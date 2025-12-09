import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { polishContent } from '@/lib/ai/polisher';
import { scrapeArticleContent } from '@/lib/ingest';
import { getImageForCategory, CATEGORY_IMAGES } from '@/lib/constants';

const isDev = process.env.NODE_ENV === 'development';

// Use lazy initialization for Supabase to allow env vars to be loaded first
let supabase: SupabaseClient | null = null;

function getSupabase() {
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false }
        });
    }
    return supabase;
}

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
    // India
    { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'India' },
    { url: 'https://www.ndtv.com/rss/top-stories', category: 'India' },
    { url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'India' },
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

export async function ingestNews(limit?: number, category?: string) {
    if (isDev) console.log(`Starting ingestion via API... Limit: ${limit}, Category: ${category || 'All'}`);
    const results: string[] = [];

    // Shuffle feeds
    const shuffledFeeds = [...FEEDS].sort(() => Math.random() - 0.5);

    // Filter by category if provided
    let candidateFeeds = shuffledFeeds;
    if (category) {
        candidateFeeds = shuffledFeeds.filter(f => f.category.toLowerCase() === category.toLowerCase());
        if (candidateFeeds.length === 0) {
            console.warn(`No feeds found for category: ${category}`);
            return [];
        }
    }

    // If limit is provided, use it; otherwise default to 5 feeds (for cron)
    // If limit is -1, process ALL candidate feeds
    const selectedFeeds = limit === -1 ? candidateFeeds : candidateFeeds.slice(0, limit || 5);

    for (const feedConfig of selectedFeeds) {
        try {
            if (isDev) console.log(`Fetching ${feedConfig.url}...`);
            const feed = await parser.parseURL(feedConfig.url);
            // If full run (-1), process more items (e.g., 3), otherwise 2
            const itemsToProcess = feed.items.slice(0, limit === -1 ? 3 : 2);

            for (const item of itemsToProcess) {
                if (!item.link || !item.title) continue;

                let polished;
                try {
                    // Scrape full content if possible
                    let fullContent = item.content || "";
                    if (!fullContent || fullContent.length < 500) {
                        if (isDev) console.log(`Scraping full content for: ${item.title}`);
                        const scraped = await scrapeArticleContent(item.link);
                        if (scraped.length > fullContent.length) {
                            fullContent = scraped;
                        }
                    }

                    // Fallback to snippet if scraping failed
                    const textToPolish = fullContent || item.contentSnippet || "";

                    polished = await polishContent(textToPolish, item.title);
                    // Preserve the full scraped content if AI returns short summary
                    if (polished.content.length < fullContent.length) {
                        // If AI just summarized it, we might want to keep the original full text 
                        // but usually polishContent returns a rewritten article.
                        // Let's trust polishContent but ensure we passed enough data.
                    }
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

                const { error } = await getSupabase().from('articles').upsert({
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

                // Cooldown removed for Paid Tier
                // if (isDev) console.log("   ⏳ Cooldown (5s) for API limits...");
                // await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (e) {
            console.error(`Error fetching ${feedConfig.url}:`, e);
        }
    }

    return results;
}
