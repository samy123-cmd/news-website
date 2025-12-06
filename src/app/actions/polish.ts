'use server';

import { createClient } from '@/lib/supabase/server';
import { scrapeArticleContent } from '@/lib/ingest';
import { polishContent } from '@/lib/ai/polisher';

export async function polishArticleAction(articleId: string, articleUrl: string, articleTitle: string) {
    try {
        console.log(`[Polisher] Starting background polish for ${articleId}`);
        const supabase = await createClient();

        // 1. Scrape full content
        const rawText = await scrapeArticleContent(articleUrl);

        if (!rawText || rawText.length < 200) {
            console.log(`[Polisher] Scraped content too short for ${articleId}`);
            return { success: false, message: "Could not scrape sufficient content" };
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

        console.log(`[Polisher] Successfully polished ${articleId}`);
        // Note: revalidatePath cannot be called during render
        // The article page uses revalidate=300 which will naturally refresh
        return { success: true };

    } catch (error) {
        console.error(`[Polisher] Action failed for ${articleId}:`, error);
        return { success: false, message: "Internal server error during polishing" };
    }
}

