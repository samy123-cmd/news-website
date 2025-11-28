
import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const parser = new Parser();
const genAI = new GoogleGenerativeAI(geminiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const FEEDS = [
    // World
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',

    // Business
    'http://feeds.bbci.co.uk/news/business/rss.xml',
    'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',

    // Tech
    'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://feeds.feedburner.com/TechCrunch/',

    // Entertainment
    'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml',

    // Sports
    'http://feeds.bbci.co.uk/sport/rss.xml',
    'https://www.espn.com/espn/rss/news',

    // Science
    'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://www.sciencedaily.com/rss/top/science.xml'
];

async function polishContent(text: string, originalHeadline: string) {
    if (!geminiKey) return { headline: originalHeadline, summary: text, category: "General", subcategory: "News" };

    try {
        const prompt = `
          Act as a senior editor. Polish this news.
          Input Headline: "${originalHeadline}"
          Input Text: "${text}"
          Output JSON ONLY: { "headline": "...", "summary": "...", "category": "...", "subcategory": "..." }
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("AI Error:", e);
        return { headline: originalHeadline, summary: text, category: "General", subcategory: "News" };
    }
}

const CATEGORY_IMAGES: Record<string, string[]> = {
    "World": [
        "https://images.unsplash.com/photo-1529243856184-4f8c17728c47?w=800&q=80", // General News
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Globe
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"  // Newspaper
    ],
    "Business": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Chart
        "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80", // Stock
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"  // Skyscraper
    ],
    "Technology": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Chip
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80", // Code
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"  // Matrix
    ],
    "Entertainment": [
        "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&q=80", // Concert
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80", // Movie
        "https://images.unsplash.com/photo-1514525253440-b393452e3720?w=800&q=80"  // Party
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Sport generic
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80", // Football
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"  // Gym/Active
    ],
    "Science": [
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80", // Microscope
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", // Lab
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"  // Space
    ],
    "Health": [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80", // Stethoscope
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80", // Healthy food
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"  // Fitness
    ],
    "General": [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"
    ]
};

function getImageForCategory(category: string): string {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["General"];
    return images[Math.floor(Math.random() * images.length)];
}

function getRelatedImages(category: string, mainImage: string): string[] {
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["General"];
    // Return 2-3 images, ensuring we include the main one and some others
    const related = [mainImage];
    for (const img of images) {
        if (img !== mainImage && related.length < 3) {
            related.push(img);
        }
    }
    return related;
}

async function run() {
    console.log("Starting test ingestion...");
    console.log("Supabase URL:", supabaseUrl);

    // Custom parser options to get media
    const parser = new Parser({
        customFields: {
            item: [
                ['media:content', 'mediaContent', { keepArray: true }],
                ['media:group', 'mediaGroup'],
                ['enclosure', 'enclosure']
            ]
        }
    });

    for (const url of FEEDS) {
        try {
            console.log(`Fetching ${url}...`);
            const feed = await parser.parseURL(url);
            console.log(`Found ${feed.items.length} items.`);

            for (const item of feed.items) { // Process all items
                if (!item.link || !item.title) continue;
                console.log(`Processing: ${item.title}`);

                const polished = await polishContent(item.contentSnippet || "", item.title);
                console.log(`Polished: ${polished.headline}`);

                // Extract Image
                let imageUrl = null;

                // Try media:content
                if (item.mediaContent && item.mediaContent.length > 0) {
                    imageUrl = item.mediaContent[0].$.url;
                }
                // Try enclosure
                else if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                }
                // Try finding image in content
                else if (item.content) {
                    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                    }
                }

                // Fallback if no image found
                if (!imageUrl) {
                    imageUrl = getImageForCategory(polished.category);
                }

                const relatedImages = getRelatedImages(polished.category, imageUrl);

                const { error } = await supabase.from('articles').upsert({
                    title: polished.headline,
                    url: item.link,
                    summary: polished.summary,
                    source: feed.title || 'Unknown',
                    published_at: new Date().toISOString(),
                    category: polished.category,
                    subcategory: polished.subcategory,
                    image_url: imageUrl,
                    images: relatedImages
                }, { onConflict: 'url' });

                if (error) console.error("DB Error:", error);
                else console.log("Inserted successfully!");
            }
        } catch (e) {
            console.error("Feed Error:", e);
        }
    }
}

run();
