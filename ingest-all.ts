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

// Create client with persistSession: false to avoid schema cache issues in long-running scripts
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
    console.log("Starting full ingestion from DB feeds...");

    // 1. Fetch feeds from DB
    const { data: feeds, error: feedError } = await supabase
        .from('feeds')
        .select('*')
        .eq('active', true);

    if (feedError || !feeds || feeds.length === 0) {
        console.error("Error fetching feeds or no feeds found:", feedError);
        return;
    }

    console.log(`Found ${feeds.length} active feeds.`);

    // 2. Shuffle feeds
    const shuffledFeeds = [...feeds].sort(() => Math.random() - 0.5);

    // 3. Process feeds
    for (const feed of shuffledFeeds) {
        try {
            console.log(`Fetching ${feed.name} (${feed.url})...`);
            const feedData = await parser.parseURL(feed.url);

            // Process top 3 items per feed
            const itemsToProcess = feedData.items.slice(0, 3);

            for (const item of itemsToProcess) {
                if (!item.link || !item.title) continue;
                console.log(`Processing: ${item.title}`);

                let polished;
                try {
                    // Try AI polishing
                    polished = await polishContent(item.contentSnippet || item.content || "", item.title);
                } catch (e) {
                    console.error("AI Polish Error, using fallback:", e);
                    polished = {
                        headline: item.title,
                        summary: (item.contentSnippet || "").substring(0, 200),
                        category: feed.category, // Use feed category as fallback
                        subcategory: feed.category,
                        sentiment: 'Neutral',
                        readTime: 5,
                        content: item.content || ""
                    };
                }

                // Ensure category is valid (fallback to feed category if AI fails or returns General)
                if (!polished.category || polished.category === 'General') {
                    polished.category = feed.category;
                    polished.subcategory = feed.category;
                }

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

                // Upsert article
                const { error } = await supabase.from('articles').upsert({
                    title: polished.headline,
                    url: item.link,
                    summary: polished.summary,
                    content: polished.content || item.content || "",
                    source: feed.name,
                    published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    category: polished.category,
                    subcategory: polished.subcategory,
                    image_url: imageUrl,
                    images: relatedImages,
                    sentiment: polished.sentiment,
                    read_time: polished.readTime
                }, { onConflict: 'url' });

                if (error) console.error("DB Error:", error);
                else console.log(`Inserted: ${polished.headline} [${polished.category}]`);

                // Delay 1s between items
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // Delay 1s between feeds
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            console.error(`Error fetching ${feed.url}:`, e);
        }
    }
    console.log("Ingestion complete!");
    process.exit(0);
}

run();
