import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { polishContent } from '@/lib/ai/polisher';
import { getImageForCategory, CATEGORY_IMAGES } from '@/lib/constants';

// Use Service Role Key for ingestion to bypass RLS and ensure writes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent', { keepArray: true }],
            ['media:group', 'mediaGroup'],
            ['enclosure', 'enclosure']
        ]
    }
});

const FEEDS = [
    // World
    { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World' },
    // Business
    { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', category: 'Business' },
    // Tech
    { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { url: 'https://feeds.feedburner.com/TechCrunch/', category: 'Technology' },
    // Entertainment
    { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment' },
    { url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', category: 'Entertainment' },
    // Sports
    { url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports' },
    { url: 'https://www.espn.com/espn/rss/news', category: 'Sports' },
    // Science
    { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
    { url: 'https://www.sciencedaily.com/rss/top/science.xml', category: 'Science' },
    // Opinion
    { url: 'https://www.theguardian.com/uk/commentisfree/rss', category: 'Opinion' },
    { url: 'https://www.scmp.com/rss/91/feed', category: 'Opinion' },
    { url: 'https://www.project-syndicate.org/rss', category: 'Opinion' }
];

function getRelatedImages(category: string, mainImage: string): string[] {
    const images = CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES["General"];
    const related = [mainImage];
    for (const img of images) {
        if (img !== mainImage && related.length < 3) {
            related.push(img);
        }
    }
    return related;
}

export async function ingestNews() {
    console.log("Starting ingestion via API...");
    const results: string[] = [];

    // Shuffle feeds
    const shuffledFeeds = [...FEEDS].sort(() => Math.random() - 0.5);

    // Limit to 5 feeds per run to avoid timeouts in serverless functions (Vercel limit is 10s-60s)
    const selectedFeeds = shuffledFeeds.slice(0, 5);

    for (const feedConfig of selectedFeeds) {
        try {
            console.log(`Fetching ${feedConfig.url}...`);
            const feed = await parser.parseURL(feedConfig.url);
            const itemsToProcess = feed.items.slice(0, 2); // Process 2 items per feed

            for (const item of itemsToProcess) {
                if (!item.link || !item.title) continue;

                let polished;
                try {
                    polished = await polishContent(item.contentSnippet || item.content || "", item.title);
                } catch (e) {
                    console.error("AI Polish Error:", e);
                    polished = {
                        headline: item.title,
                        summary: (item.contentSnippet || "").substring(0, 200),
                        category: feedConfig.category,
                        subcategory: feedConfig.category,
                        sentiment: 'Neutral',
                        readTime: 5,
                        content: item.content || ""
                    };
                }

                if (!polished.category || polished.category === 'General') {
                    polished.category = feedConfig.category;
                    polished.subcategory = feedConfig.category;
                }

                let imageUrl = null;
                if (item.mediaContent && item.mediaContent.length > 0) {
                    imageUrl = item.mediaContent[0].$.url;
                } else if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                } else if (item.content) {
                    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                if (!imageUrl) {
                    imageUrl = getImageForCategory(polished.category);
                }

                const relatedImages = getRelatedImages(polished.category, imageUrl);

                const { error } = await supabase.from('articles').upsert({
                    title: polished.headline,
                    url: item.link,
                    summary: polished.summary,
                    content: polished.content || item.content || "",
                    source: feed.title || 'Unknown',
                    published_at: new Date().toISOString(),
                    category: polished.category,
                    subcategory: polished.subcategory,
                    image_url: imageUrl,
                    images: relatedImages,
                    sentiment: polished.sentiment,
                    read_time: polished.readTime,
                    // status: 'published' - relying on DB default
                } as any, { onConflict: 'url' });

                if (!error) {
                    results.push(polished.headline);
                }
            }
        } catch (e) {
            console.error(`Error fetching ${feedConfig.url}:`, e);
        }
    }

    return results;
}
