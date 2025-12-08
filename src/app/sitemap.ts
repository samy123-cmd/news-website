import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { REGIONS } from './edition/[region]/page';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ainews-olive.vercel.app';

// Categories for sitemap
const CATEGORIES = ['World', 'India', 'Business', 'Technology', 'Entertainment', 'Sports', 'Science', 'Opinion'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Fetch all articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, published_at')
        .order('published_at', { ascending: false })
        .limit(5000);

    const articleUrls = (articles || []).map((article) => ({
        url: `${BASE_URL}/article/${article.id}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    // Category pages for SEO
    const categoryUrls = CATEGORIES.map((cat) => ({
        url: `${BASE_URL}/?category=${cat}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.9,
    }));

    // Regional Editions
    const regionUrls = Object.keys(REGIONS).map((slug) => ({
        url: `${BASE_URL}/edition/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.85,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/headlines`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/careers`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/site-map`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/submit`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/advertisers`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/press-center`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/developer-api`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/rss-feeds`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/newsletters`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/accessibility`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/cookie-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/apps`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...categoryUrls,
        ...regionUrls,
        ...articleUrls,
    ];
}
