import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, category, author_name, author_email } = body;

        if (!title || !content || !category || !author_name || !author_email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();

        // Generate a URL slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const uniqueUrl = `https://global-ai-news.com/article/${slug}-${Date.now()}`;

        const { error } = await supabase
            .from('articles')
            .insert({
                title,
                content, // We might want to polish this later, but for now raw input
                summary: content.substring(0, 200) + '...',
                category,
                author_name,
                author_email,
                status: 'pending', // Pending review
                url: uniqueUrl, // Placeholder URL
                published_at: new Date().toISOString(),
                source: 'Community Submission'
            } as any);

        if (error) {
            console.error("Submission Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
