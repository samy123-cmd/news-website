import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateApiKey, getCachedValidation } from '@/lib/ai/validateApiKey';
import { getRateLimiterStatus } from '@/lib/ai/rateLimiter';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
        database: { status: string; latency?: number };
        ai: { status: string; model?: string; error?: string };
        rateLimiter: { tokens: number; failures: number };
    };
    version: string;
}

export async function GET() {
    const startTime = Date.now();
    const health: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
            database: { status: 'unknown' },
            ai: { status: 'unknown' },
            rateLimiter: getRateLimiterStatus()
        },
        version: process.env.npm_package_version || '0.1.0'
    };

    // Check Database
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            health.checks.database = { status: 'unconfigured' };
            health.status = 'degraded';
        } else {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dbStart = Date.now();
            const { error } = await supabase.from('articles').select('id').limit(1);
            const dbLatency = Date.now() - dbStart;

            if (error) {
                health.checks.database = { status: 'error', latency: dbLatency };
                health.status = 'unhealthy';
            } else {
                health.checks.database = { status: 'ok', latency: dbLatency };
            }
        }
    } catch (e: any) {
        health.checks.database = { status: `error: ${e.message}` };
        health.status = 'unhealthy';
    }

    // Check AI Service
    try {
        // Use cached validation if available, otherwise validate
        let validation = getCachedValidation();
        if (!validation) {
            validation = await validateApiKey();
        }

        if (validation.isValid && validation.preferredModel) {
            health.checks.ai = {
                status: 'ok',
                model: validation.preferredModel
            };
        } else {
            health.checks.ai = {
                status: 'unavailable',
                error: validation.error
            };
            // AI being down is degraded, not unhealthy
            if (health.status === 'healthy') {
                health.status = 'degraded';
            }
        }
    } catch (e: any) {
        health.checks.ai = { status: `error: ${e.message}` };
        if (health.status === 'healthy') {
            health.status = 'degraded';
        }
    }

    // Determine HTTP status code
    const httpStatus = health.status === 'unhealthy' ? 503 : 200;

    return NextResponse.json(health, {
        status: httpStatus,
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
}
