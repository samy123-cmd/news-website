"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementView(articleId: string) {
    const supabase = await createClient();

    // Try to call the RPC function first (atomic increment)
    const { error: rpcError } = await supabase.rpc('increment_article_view', { article_id: articleId });

    if (rpcError) {
        // Fallback: If RPC doesn't exist, try direct update (less safe for concurrency but works for MVP)
        // Note: This requires the 'views' column to exist on the 'articles' table.
        // SQL: ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

        // We first get the current count
        const { data: article } = await supabase
            .from('articles')
            .select('views')
            .eq('id', articleId)
            .single();

        if (article) {
            const currentViews = article.views || 0;
            await supabase
                .from('articles')
                .update({ views: currentViews + 1 })
                .eq('id', articleId);
        }
    }
}
