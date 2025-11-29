import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import * as dotenv from 'dotenv';
import { polishContent } from './src/lib/ai/polisher';
import { getImageForCategory, CATEGORY_IMAGES } from './src/lib/constants';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
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
    // { url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World' },
    // // Business
    // { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    // { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', category: 'Business' },
    // // Tech
    // { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    // { url: 'https://feeds.feedburner.com/TechCrunch/', category: 'Technology' },
    // // Entertainment
    // { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment' },
    // { url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', category: 'Entertainment' },
    // // Sports
    // { url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports' },
    // { url: 'https://www.espn.com/espn/rss/news', category: 'Sports' },
    // // Science
    // { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
    // { url: 'https://www.sciencedaily.com/rss/top/science.xml', category: 'Science' },
    // // Opinion
    // { url: 'https://www.theguardian.com/uk/commentisfree/rss', category: 'Opinion' },
    // { url: 'https://www.scmp.com/rss/91/feed', category: 'Opinion' },
    // { url: 'https://www.project-syndicate.org/rss', category: 'Opinion' }
];

function getRelatedImages(category: string, mainImage: string): string[] {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["General"];
    const related = [mainImage];
    for (const img of images) {
        if (img !== mainImage && related.length < 3) {
            related.push(img);
        }
    }
    return related;
}

async function run() {
    console.log("Starting robust manual ingestion...");

    // Shuffle feeds to ensure variety
    const shuffledFeeds = [...FEEDS].sort(() => Math.random() - 0.5);

    for (const feedConfig of shuffledFeeds) {
        try {
            console.log(`Fetching ${feedConfig.url} (${feedConfig.category})...`);
            const feed = await parser.parseURL(feedConfig.url);
            console.log(`Found ${feed.items.length} items.`);

            // Process only first 3 items per feed
            const itemsToProcess = feed.items.slice(0, 3);

            for (const item of itemsToProcess) {
                if (!item.link || !item.title) continue;
                console.log(`Processing: ${item.title}`);

                let polished;
                try {
                    polished = await polishContent(item.contentSnippet || item.content || "", item.title);
                } catch (e) {
                    console.error("AI Polish Error, using fallback:", e);
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

                // Fallback category if AI returns General or something else
                if (!polished.category || polished.category === 'General') {
                    polished.category = feedConfig.category;
                    polished.subcategory = feedConfig.category; // Simple fallback
                }

                console.log(`Final Category: ${polished.category}`);

                // Extract Image
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

                // Create fresh client for each request to avoid schema cache issues
                const supabaseItem = createClient(supabaseUrl!, serviceRoleKey!, {
                    auth: { persistSession: false }
                });

                const { error } = await supabaseItem.from('articles').upsert({
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
                    // read_time: polished.readTime // Column missing in DB
                }, { onConflict: 'url' });

                if (error) console.error("DB Error:", error);
                else {
                    console.log("Inserted/Updated successfully!");
                    // Verify persistence
                    const { data: verify } = await supabaseItem
                        .from('articles')
                        .select('category')
                        .eq('url', item.link)
                        .single();
                    console.log(`VERIFY DB: URL=${item.link} Category=${verify?.category}`);
                }

                // Delay 1s
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // Delay 2s between feeds
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.error(`Error fetching ${feedConfig.url}:`, e);
        }
    }
    console.log("Ingestion complete!");
}

run();
