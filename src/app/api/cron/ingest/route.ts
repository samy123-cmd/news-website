
import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { polishContent } from "@/lib/ai/polisher";
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

// Will be initialized lazily in the handler
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (supabase) return supabase;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Explicit: jsdom requires Node.js runtime
export const maxDuration = 55; // Leave 5s buffer before Vercel's 60s limit

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
    'https://www.sciencedaily.com/rss/top/science.xml',
    // Opinion
    'https://www.theguardian.com/uk/commentisfree/rss',
    'https://www.scmp.com/rss/91/feed',
    'https://www.project-syndicate.org/rss'
];

const CATEGORY_IMAGES: Record<string, string[]> = {
    "World": [
        "https://images.unsplash.com/photo-1529243856184-4f8c17728c47?w=800&q=80",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"
    ],
    "Business": [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    ],
    "Technology": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    ],
    "Entertainment": [
        "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&q=80",
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1514525253440-b393452e3720?w=800&q=80"
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80"
    ],
    "Science": [
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
    ],
    "Health": [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
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
    const related = [mainImage];
    for (const img of images) {
        if (img !== mainImage && related.length < 3) {
            related.push(img);
        }
    }
    return related;
}

export async function GET(request: Request) {
    // Security Check
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const authHeader = request.headers.get('authorization');

    if (key !== process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) console.log("Starting automated ingestion...");
    const parser = new Parser({
        customFields: {
            item: [
                ['media:content', 'mediaContent', { keepArray: true }],
                ['media:group', 'mediaGroup'],
                ['enclosure', 'enclosure']
            ]
        }
    });

    let processedCount = 0;
    let errorCount = 0;

    // Shuffle feeds to avoid always hitting the same ones first if we timeout
    const shuffledFeeds = [...FEEDS].sort(() => Math.random() - 0.5);

    for (const url of shuffledFeeds) {
        // Break if we've processed enough for one run (to avoid timeout)
        if (processedCount >= 3) break; // Limited to 3 for Gemini free tier rate limits

        try {
            const feed = await parser.parseURL(url);

            // Take only top 2 items from each feed to spread coverage
            for (const item of feed.items.slice(0, 2)) {
                if (!item.link || !item.title) continue;

                // Check if exists
                const { data: existing } = await getSupabaseClient()
                    .from('articles')
                    .select('id')
                    .eq('url', item.link)
                    .single();

                if (existing) continue;

                // Fetch full content
                let fullContent = item.contentSnippet || item.content || "";
                try {
                    const response = await fetch(item.link, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobalAINews/1.0;)' } });
                    if (response.ok) {
                        const html = await response.text();
                        const dom = new JSDOM(html, { url: item.link });
                        const reader = new Readability(dom.window.document);
                        const article = reader.parse();
                        if (article && article.textContent) {
                            fullContent = article.textContent;
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch full content for ${item.link}:`, err);
                }

                // Delay before AI call to avoid rate limits
                await new Promise(r => setTimeout(r, 3000));

                const polished = await polishContent(fullContent, item.title);

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

                const { error } = await getSupabaseClient().from('articles').insert({
                    title: polished.headline,
                    url: item.link,
                    summary: polished.summary,
                    content: polished.content, // Save the full AI-written content
                    source: feed.title || 'Unknown',
                    published_at: new Date().toISOString(),
                    category: polished.category,
                    subcategory: polished.subcategory,
                    image_url: imageUrl,
                    images: relatedImages,
                    status: 'published' // Auto-publish for now
                } as any);

                if (error) {
                    console.error("DB Error:", error);
                    errorCount++;
                } else {
                    processedCount++;
                }
            }
        } catch (e) {
            console.error(`Feed Error (${url}):`, e);
            errorCount++;
            // Continue to next feed instead of crashing
            continue;
        }
    }

    return NextResponse.json({
        success: true,
        processed: processedCount,
        errors: errorCount,
        message: `Ingested ${processedCount} new articles.`
    });
}
