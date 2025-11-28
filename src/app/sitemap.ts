import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://global-ai-news.com';

    // In a real app, you would fetch these from your database
    const categories = ['World', 'Business', 'Technology', 'Sports', 'Entertainment'];

    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/?category=${cat}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        ...categoryUrls,
    ];
}
