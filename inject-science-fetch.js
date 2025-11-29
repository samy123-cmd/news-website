import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import Parser from 'rss-parser';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const parser = new Parser();

async function fetchScience() {
    console.log("Fetching Science articles...");

    // Get Science feeds
    const { data: feeds } = await supabase
        .from('feeds')
        .select('*')
        .eq('category', 'Science')
        .eq('active', true);

    if (!feeds || feeds.length === 0) {
        console.log("No active Science feeds found.");
        return;
    }

    for (const feed of feeds) {
        console.log(`Processing ${feed.name}...`);
        try {
            const feedData = await parser.parseURL(feed.url);

            // Process last 5 items
            const items = feedData.items.slice(0, 5);

            for (const item of items) {
                const article = {
                    title: item.title,
                    content: item.content || item.contentSnippet || item.summary || "",
                    summary: item.contentSnippet || item.summary || "",
                    url: item.link,
                    source: feed.name,
                    category: 'Science',
                    published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    image_url: null // Simplified for speed
                };

                const { error } = await supabase
                    .from('articles')
                    .upsert(article, { onConflict: 'url' });

                if (error) console.error(`Error saving ${article.title}:`, error.message);
                else console.log(`Saved: ${article.title}`);
            }
        } catch (e) {
            console.error(`Failed to process ${feed.name}:`, e.message);
        }
    }
    console.log("Done fetching.");
}

fetchScience();
