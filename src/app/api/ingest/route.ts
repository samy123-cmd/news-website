import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { ingestTwitter } from '@/lib/news/twitter';

export async function GET() {
    try {
        const [newsResults, twitterResults] = await Promise.all([
            ingestNews(),
            ingestTwitter()
        ]);

        const allResults = [...newsResults, ...twitterResults];

        return NextResponse.json({
            success: true,
            count: allResults.length,
            articles: allResults
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
