
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainews-olive.vercel.app';

export async function GET() {
    const supabase = await createClient();

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, summary, category, published_at, image_url')
        .eq('status', 'published') // Ensure we only show published articles
        .order('published_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('RSS Feed Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    const items = articles?.map((article) => {
        const link = `${BASE_URL}/article/${article.id}`;
        const category = typeof article.category === 'string' ? article.category : 'General';

        return `
        <item>
            <title><![CDATA[${article.title || ''}]]></title>
            <link>${link}</link>
            <guid>${link}</guid>
            <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
            <description><![CDATA[${article.summary || ''}]]></description>
            <category><![CDATA[${category}]]></category>
            ${article.image_url ? `<enclosure url="${article.image_url.replace(/&/g, '&amp;')}" type="image/jpeg" />` : ''}
        </item>
        `;
    }).join('') || '';

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Global AI News</title>
        <link>${BASE_URL}</link>
        <description>Real-time, AI-curated journalism from verified global sources.</description>
        <language>en-us</language>
        <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
        ${items}
    </channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'text/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate', // Cache for 1 hour
        },
    });
}
