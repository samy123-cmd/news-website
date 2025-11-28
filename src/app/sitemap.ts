
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://news-project.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Fetch all articles
    // Fetch articles from the last 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: articles } = await supabase
        .from('articles')
        .select('id, published_at')
        .gte('published_at', fortyEightHoursAgo)
        .order('published_at', { ascending: false });

    const articleUrls = (articles || []).map((article) => ({
        url: `${BASE_URL}/article/${article.id}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    const staticRoutes = [
        '',
        '/headlines',
        '/about-us',
        '/careers',
        '/code-of-ethics',
        '/privacy-policy',
        '/terms-of-service',
        '/help-center',
        '/advertisers',
        '/press-center',
        '/developer-api',
        '/rss-feeds',
        '/newsletters',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.5,
    }));

    const editions = [
        'united-states',
        'india',
        'united-kingdom',
        'europe',
        'asia-pacific',
        'middle-east',
        'africa',
    ].map((region) => ({
        url: `${BASE_URL}/edition/${region}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    return [
        ...staticRoutes,
        ...editions,
        ...articleUrls,
    ];
}
