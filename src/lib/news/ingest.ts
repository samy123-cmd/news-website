import Parser from 'rss-parser';
import { createClient } from '@/lib/supabase/server';
import { polishContent } from '@/lib/ai/polisher';

const parser = new Parser();

const FEEDS = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.thehindu.com/news/national/feeder/default.rss',
    'https://feeds.feedburner.com/ndtvnews-top-stories',
];

import { scrapeArticle } from '@/lib/news/scraper';

// ... (imports)

// ... (FEEDS array)

export async function ingestNews() {
    const supabase = await createClient();
    const results = [];

    for (const url of FEEDS) {
        try {
            const feed = await parser.parseURL(url);

            for (const item of feed.items) {
                if (!item.link || !item.title) continue;

                // 1. Check if article exists
                const { data: existing, error: fetchError } = await supabase
                    .from('articles')
                    .select('id')
                    .eq('url', item.link)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    console.error("Error checking existence:", fetchError);
                }

                if (existing) {
                    continue;
                }

                // 2. Scrape Full Content
                const scraped = await scrapeArticle(item.link);
                const fullContent = scraped?.content || item.content || item.contentSnippet || "";
                const images = scraped?.images || [];

                // 3. Polish Content with AI (pass full text if available, or summary)
                // We pass the scraped text content for better AI summarization
                const textToPolish = scraped?.textContent || item.contentSnippet || "";
                const polished = await polishContent(textToPolish.substring(0, 5000), item.title); // Limit text length for AI

                // 4. Insert into DB
                const { error } = await supabase
                    .from('articles')
                    .insert({
                        title: polished.headline,
                        url: item.link,
                        summary: polished.summary,
                        content: fullContent, // Store full HTML content
                        source: feed.title || 'Unknown',
                        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        language: 'en',
                        category: polished.category,
                        subcategory: polished.subcategory,
                        images: images, // Store extracted images
                        image_url: images.length > 0 ? images[0] : null // Use first scraped image as thumbnail if available
                    });

                if (error) {
                    console.error('Error inserting article:', error);
                } else {
                    results.push(polished.headline);
                }
            }
        } catch (e) {
            console.error(`Error fetching feed ${url}:`, e);
        }
    }

    return results;
}
