
import { ingestNews } from '@/lib/news/ingest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel Hobby limit

export async function GET(request: Request) {
    try {
        // ---------------------------------------------------------------------
        // 1. Security Check
        // ---------------------------------------------------------------------
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');
        const authHeader = request.headers.get('authorization');

        // Allow if CRON_SECRET matches query param OR header
        const isAuthorized =
            (key === process.env.CRON_SECRET) ||
            (authHeader === `Bearer ${process.env.CRON_SECRET}`);

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ---------------------------------------------------------------------
        // 2. Execute Ingestion with Time Budget
        // ---------------------------------------------------------------------
        // We give it 55s max, leaving 5s for response & overhead
        const result = await ingestNews({
            limit: -1,       // Process all new articles found
            maxTimeMs: 55000 // 55 seconds budget
        });

        // ---------------------------------------------------------------------
        // 3. Response
        // ---------------------------------------------------------------------
        return NextResponse.json({
            success: true,
            summary: `Run complete in ${result.durationMs}ms`,
            details: result
        });

    } catch (error: any) {
        console.error("CRON_FATAL_ERROR:", error);
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 200 }); // Return 200 to prevent Vercel Cron retry loops
    }
}
