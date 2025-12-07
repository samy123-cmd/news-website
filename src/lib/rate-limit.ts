/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for API routes.
 * Note: For production on serverless (Vercel), consider using Upstash Redis
 * for distributed rate limiting across instances.
 */

interface RateLimitConfig {
    /** Maximum number of requests allowed in the interval */
    limit: number;
    /** Time window in milliseconds */
    interval: number;
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store - resets on cold starts (OK for basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanupOldEntries(): void {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Get client identifier from request
 * Uses X-Forwarded-For header (set by Vercel/proxies) or falls back to a default
 */
export function getClientIdentifier(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    // X-Forwarded-For can contain multiple IPs, take the first one (original client)
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback for local development
    return 'unknown-client';
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (usually IP)
 * @param endpoint - API endpoint name for namespacing
 * @param config - Rate limit configuration
 * @returns Object with allowed status and rate limit info
 */
export function rateLimit(
    identifier: string,
    endpoint: string,
    config: RateLimitConfig
): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
    limit: number;
} {
    cleanupOldEntries();

    const key = `${endpoint}:${identifier}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // If no entry or window expired, create new entry
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 1,
            resetTime: now + config.interval
        };
        rateLimitStore.set(key, entry);

        return {
            allowed: true,
            remaining: config.limit - 1,
            resetIn: config.interval,
            limit: config.limit
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, config.limit - entry.count);
    const resetIn = entry.resetTime - now;

    return {
        allowed: entry.count <= config.limit,
        remaining,
        resetIn,
        limit: config.limit
    };
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(info: { remaining: number; resetIn: number; limit: number }): Record<string, string> {
    return {
        'X-RateLimit-Limit': info.limit.toString(),
        'X-RateLimit-Remaining': info.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(info.resetIn / 1000).toString(),
    };
}

// Preset configurations for different endpoints
export const RATE_LIMITS = {
    /** Article submission: 5 requests per minute */
    SUBMIT: { limit: 5, interval: 60 * 1000 },

    /** Newsletter subscribe: 3 requests per minute */
    NEWSLETTER: { limit: 3, interval: 60 * 1000 },

    /** Search API: 30 requests per minute */
    SEARCH: { limit: 30, interval: 60 * 1000 },

    /** General API: 60 requests per minute */
    GENERAL: { limit: 60, interval: 60 * 1000 },
} as const;
