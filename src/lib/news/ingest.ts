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

export async function ingestNews() {
    const supabase = await createClient();
    const results = [];

    for (const url of FEEDS) {
        try {
            const feed = await parser.parseURL(url);

            for (const item of feed.items) {
                if (!item.link || !item.title) continue;

                // 1. Check if article exists to save AI costs
                const { data: existing } = await supabase
                    .from('articles')
                    .select('id')
                    .eq('url', item.link)
                    .single();

                if (existing) continue;

                // 2. Polish Content with AI
                const rawSummary = item.contentSnippet || item.content || "";
                const polished = await polishContent(rawSummary, item.title);

                // 3. Insert into DB
                const { error } = await supabase
                    .from('articles')
                    .insert({
                        title: polished.headline, // Use AI-refined headline
                        url: item.link,
                        summary: polished.summary, // Use AI summary
                        source: feed.title || 'Unknown',
                        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        language: 'en',
                        category: polished.category,
                        subcategory: polished.subcategory,
                        // We could also store sentiment/readTime if we added columns for them
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
