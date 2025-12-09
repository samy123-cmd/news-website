import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { polishContent } from '@/lib/ai/polisher';

// Admin API to re-polish failed articles
export async function POST(request: NextRequest) {
    // Simple auth check (should be enhanced for production)
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.ADMIN_API_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    );

    try {
        const body = await request.json();
        const { articleId, limit = 10 } = body;

        // If articleId provided, re-polish single article
        if (articleId) {
            const { data: article, error } = await supabase
                .from('articles')
                .select('id, title, content')
                .eq('id', articleId)
                .single();

            if (error || !article) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }

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
                .eq('id', articleId);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: `Re-polished article: ${article.title}`,
                ai_processed: polished.ai_processed
            });
        }

        // Batch re-polish: find articles where ai_processed = false
        const { data: articles, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, content')
            .eq('ai_processed', false)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (fetchError) {
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

        for (const article of articles) {
            try {
                const polished = await polishContent(article.content, article.title);

                await supabase
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

                if (polished.ai_processed) {
                    successCount++;
                } else {
                    failCount++;
                }

                // Rate limiting delay
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (e) {
                console.error(`Failed to re-polish ${article.id}:`, e);
                failCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Re-polish complete`,
            processed: articles.length,
            succeeded: successCount,
            failed: failCount
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
