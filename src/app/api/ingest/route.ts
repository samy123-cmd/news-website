import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { ingestTwitter } from '@/lib/news/twitter';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const authHeader = request.headers.get('authorization');

    // Check for Vercel Cron secret or manual token
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && token !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newsResults = await ingestNews();

        return NextResponse.json({
            success: true,
            count: newsResults.length,
            articles: newsResults
        });
    } catch (error) {
        console.error("Ingest API Error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
