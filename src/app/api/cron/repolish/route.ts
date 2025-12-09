import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { polishContent } from '@/lib/ai/polisher';

/**
 * Background cron job to re-polish articles that failed AI processing.
 * Scheduled to run overnight (e.g., 3 AM) when API limits are fresh.
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [
 *     { "path": "/api/cron/repolish", "schedule": "0 3 * * *" }
 *   ]
 * }
 */

export const maxDuration = 300; // 5 minutes for batch processing

export async function GET(request: NextRequest) {
    // Verify cron secret for Vercel
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    const startTime = Date.now();
    const MAX_RUNTIME_MS = 4.5 * 60 * 1000; // 4.5 minutes max to ensure clean exit
    const BATCH_SIZE = 10;

    try {
        // Fetch articles where ai_processed = false, oldest first
        const { data: articles, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, content, url')
            .eq('ai_processed', false)
            .order('published_at', { ascending: true })
            .limit(BATCH_SIZE);

        if (fetchError) {
            console.error('[Cron Repolish] Fetch error:', fetchError);
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (!articles || articles.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No articles need re-polishing',
                processed: 0
            });
        }

        let successCount = 0;
        let failCount = 0;
        const processedIds: string[] = [];

        for (const article of articles) {
            // Check if we're running out of time
            if (Date.now() - startTime > MAX_RUNTIME_MS) {
                console.log('[Cron Repolish] Time limit reached, stopping batch');
                break;
            }

            try {
                console.log(`[Cron Repolish] Processing: ${article.title}`);

                const polished = await polishContent(article.content, article.title);

                const { error: updateError } = await supabase
                    .from('articles')
                    .update({
                        title: polished.headline,
                        summary: polished.summary,
                        content: polished.content,
                        category: polished.category,
                        subcategory: polished.subcategory,
                        sentiment: polished.sentiment,
                        read_time: polished.readTime,
                        tags: polished.tags || [],
                        curation_note: polished.curation_note || null,
                        ai_processed: polished.ai_processed ?? false,
                    })
                    .eq('id', article.id);

                if (updateError) {
                    console.error(`[Cron Repolish] Update error for ${article.id}:`, updateError);
                    failCount++;
                } else if (polished.ai_processed) {
                    successCount++;
                    processedIds.push(article.id);
                } else {
                    failCount++; // AI still unavailable
                }

                // Rate limiting delay between articles
                await new Promise(resolve => setTimeout(resolve, 5000));

            } catch (e: any) {
                console.error(`[Cron Repolish] Error processing ${article.id}:`, e.message);
                failCount++;
            }
        }

        const duration = Math.round((Date.now() - startTime) / 1000);

        return NextResponse.json({
            success: true,
            message: `Re-polish cron complete in ${duration}s`,
            total: articles.length,
            succeeded: successCount,
            failed: failCount,
            processedIds
        });

    } catch (e: any) {
        console.error('[Cron Repolish] Unexpected error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
