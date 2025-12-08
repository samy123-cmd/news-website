'use server';

import { createClient } from '@/lib/supabase/server';
import { scrapeArticleContent } from '@/lib/ingest';
import { polishContent } from '@/lib/ai/polisher';

const isDev = process.env.NODE_ENV === 'development';

export async function polishArticleAction(articleId: string, articleUrl: string, articleTitle: string) {
    try {
        if (isDev) console.log(`[Polisher] Starting polish for ${articleId}`);
        const supabase = await createClient();

        // 1. Scrape full content
        const rawText = await scrapeArticleContent(articleUrl);

        if (!rawText || rawText.length < 50) {
            if (isDev) console.log(`[Polisher] Scraped content very short/empty for ${articleId}, relying on AI generation from title.`);
            // Continue! Don't return error.
        }

        // 2. Polish with AI
        const polished = await polishContent(rawText, articleTitle);

        // 3. Update DB
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                content: polished.content,
                summary: polished.summary,
                category: polished.category,
                subcategory: polished.subcategory,
            })
            .eq('id', articleId);

        if (updateError) {
            console.error(`[Polisher] DB Update failed for ${articleId}:`, updateError);
            return { success: false, error: updateError.message };
        }

        if (isDev) console.log(`[Polisher] Successfully polished ${articleId}`);
        // Note: revalidatePath cannot be called during render
        // The article page uses revalidate=300 which will naturally refresh
        return { success: true };

    } catch (error) {
        console.error(`[Polisher] Action failed for ${articleId}:`, error);
        return { success: false, message: "Internal server error during polishing" };
    }
}

