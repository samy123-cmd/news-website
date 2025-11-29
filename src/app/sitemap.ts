import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://global-ai-news.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Fetch all articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, published_at')
        .order('published_at', { ascending: false })
        .limit(1000);

    const articleUrls = (articles || []).map((article) => ({
        url: `${BASE_URL}/article/${article.id}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...articleUrls,
    ];
}
