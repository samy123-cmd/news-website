import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import stringSimilarity from 'string-similarity';
import { NEWS_SOURCES } from './config';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';

const parser = new Parser();
const UUID_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'; // URL namespace

// 1. Helper to fetch OpenGraph Image if RSS lacks it
// 1. Helper to fetch OpenGraph Image if RSS lacks it
async function getOgImage(link: string): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for OG image

        const response = await fetch(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const html = await response.text();
        const $ = cheerio.load(html);

        // Try multiple OG tags
        const ogImage = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href');

        return ogImage || null;
    } catch (e) {
        return null; // Fallback image handles this later
    }
}

// 1b. Helper to scrape full article content
export async function scrapeArticleContent(url: string): Promise<string> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return "";

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $('script, style, nav, header, footer, iframe, .ad, .advertisement, .social-share').remove();

        // Heuristic to find article text
        // Try specific selectors first
        let text = '';
        const selectors = [
            'article',
            '[itemprop="articleBody"]',
            '.article-body',
            '.story-body',
            '.content-body',
            'main'
        ];

        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                // Get paragraphs within the container
                element.find('p').each((_, el) => {
                    const t = $(el).text().trim();
                    if (t.length > 20) text += t + '\n\n';
                });
                if (text.length > 500) break; // Found enough text
            }
        }

        // Fallback: just get all paragraphs with significant length
        if (text.length < 200) {
            text = '';
            $('p').each((_, el) => {
                const t = $(el).text().trim();
                if (t.length > 40) text += t + '\n\n';
            });
        }

        return text.trim();
    } catch (e) {
        console.error("Scrape failed", e);
        return "";
    }
}

// 2. The Normalizer: Makes every source look consistent
async function normalizeArticle(item: any, category: string) {
    // Try to find image in standard RSS fields first
    let imageUrl = item.enclosure?.url || item.contentSnippet?.match(/src="([^"]*)"/)?.[1];

    // If no image, scrape the page (Expensive, use sparingly or cache results)
    if (!imageUrl) {
        imageUrl = await getOgImage(item.link);
    }

    // Store the full content snippet instead of truncating to 150 chars
    const fullSnippet = item.contentSnippet || "";
    const summary = fullSnippet.length > 1000
        ? fullSnippet.substring(0, 1000) + "..."
        : fullSnippet;

    return {
        id: uuidv5(item.link, UUID_NAMESPACE), // Generate deterministic UUID from URL
        title: item.title,
        url: item.link, // Mapped to 'url' for NewsCard
        summary: summary,
        content: item.content || fullSnippet, // Store full content if available
        published_at: new Date(item.pubDate || item.isoDate).toISOString(), // Mapped to 'published_at'
        image_url: imageUrl || '/placeholders/default-news.jpg', // Mapped to 'image_url'
        source: item.creator || new URL(item.link).hostname.replace('www.', ''),
        category: category,
        read_time: "3", // Default read time
    };
}


// 3. The Main Fetcher
export async function fetchNewsByCategory(category: string) {
    // Fetch feeds from DB for this category
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

    const { data: feeds } = await supabaseAdmin
        .from('feeds')
        .select('url')
        .eq('category', category)
        .eq('active', true);

    if (!feeds || feeds.length === 0) {
        console.warn(`[Refinery] No active feeds found for category: ${category}`);
        return [];
    }

    const urls = feeds.map(f => f.url);
    console.log(`[Refinery] Fetching ${category} from ${urls.length} sources...`);

    const promises = urls.map(async (url) => {
        try {
            // Add timeout to parser
            const feed = await Promise.race([
                parser.parseURL(url),
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Feed timeout')), 8000))
            ]) as any;

            if (!feed || !feed.items || feed.items.length === 0) {
                console.warn(`[Refinery] Empty feed from ${url}`);
                return [];
            }

            // Limit to top 5 per source for speed (was 10)
            const topItems = feed.items.slice(0, 5);

            // Process items in parallel with individual error handling
            const itemPromises = topItems.map(async (item: any) => {
                try {
                    return await normalizeArticle(item, category);
                } catch (err) {
                    console.error(`[Refinery] Failed to normalize item from ${url}:`, err);
                    return null;
                }
            });

            const items = await Promise.all(itemPromises);
            return items.filter(i => i !== null);
        } catch (error) {
            console.error(`[Refinery] Failed to fetch ${url}:`, error);
            return [];
        }
    });

    // Use allSettled to ensure one failure doesn't stop others (though we catch above, this is extra safety)
    const results = await Promise.allSettled(promises);

    const flatResults = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<any[]>).value)
        .flat();

    // 4. THE FILTER & POLISH PIPELINE
    const processedArticles = processNewsPipeline(flatResults);

    // 5. PERSISTENCE: Save to Supabase
    // Use Service Role Key to bypass RLS for ingestion (client created at start of function)

    // Upsert articles to DB
    // We do this in chunks to avoid hitting limits if necessary, but for <100 items it's fine
    if (processedArticles.length > 0) {
        const { error } = await supabaseAdmin
            .from('articles')
            .upsert(
                processedArticles.map(a => ({
                    id: a.id,
                    title: a.title,
                    url: a.url,
                    summary: a.summary,
                    content: a.content, // Store full content
                    published_at: a.published_at,
                    image_url: a.image_url,
                    source: a.source,
                    category: a.category
                    // read_time: a.read_time // Column missing in DB
                    // status: 'published' - relying on DB default
                })),
                { onConflict: 'url' }
            );

        if (error) {
            console.error("Failed to persist articles. Error details:", JSON.stringify(error, null, 2));
            console.error("Sample payload:", JSON.stringify(processedArticles[0], null, 2));
        } else {
            // console.log(`Successfully persisted ${processedArticles.length} articles.`);
        }
    }

    return processedArticles;
}

// 5. The Logic Pipeline (Sort, Deduplicate, Polish)
function processNewsPipeline(articles: any[]) {
    const uniqueArticles: any[] = [];

    articles.forEach(article => {
        // A. Filter: Remove articles without titles or broken links
        if (!article.title || !article.url) return;

        // B. Deduplication: Check if a similar headline already exists
        // If similarity > 0.6, it's likely the same story from a different source
        const isDuplicate = uniqueArticles.some(existing =>
            stringSimilarity.compareTwoStrings(existing.title, article.title) > 0.6
        );

        if (!isDuplicate) {
            uniqueArticles.push(article);
        }
    });

    // C. Sorting: Freshness first
    return uniqueArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}
