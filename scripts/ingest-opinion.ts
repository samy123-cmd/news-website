import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const parser = new Parser();

const feeds = [
    { url: 'https://www.theguardian.com/uk/commentisfree/rss', category: 'Opinion', subcategory: 'Opinion' },
    { url: 'https://www.scmp.com/rss/91/feed', category: 'Opinion', subcategory: 'Opinion' },
    { url: 'https://www.project-syndicate.org/rss', category: 'Opinion', subcategory: 'Opinion' }
];

async function polishContent(text: string, originalHeadline: string) {
    // Dummy polisher to bypass AI for debugging
    return {
        headline: originalHeadline,
        summary: (text || "").substring(0, 200) + "...",
        category: "Opinion",
        subcategory: "Opinion"
    };
}

async function run() {
    console.log("Starting Opinion Ingestion (No AI, Fresh Clients)...");

    for (const feed of feeds) {
        try {
            console.log(`Fetching ${feed.url}...`);
            const parsed = await parser.parseURL(feed.url);

            for (const item of parsed.items.slice(0, 5)) { // Process 5 items per feed
                if (!item.title) continue;

                console.log(`Processing: ${item.title}`);
                const polished = await polishContent(item.contentSnippet || item.content || "", item.title);

                // Create fresh client for each request to avoid schema cache issues
                const supabaseItem = createClient(supabaseUrl!, serviceRoleKey!, {
                    auth: { persistSession: false }
                });

                const { error } = await supabaseItem.from('articles').upsert({
                    title: polished.headline,
                    summary: polished.summary,
                    content: item.content || item.contentSnippet || "",
                    url: item.link,
                    image_url: null,
                    source: feed.category === 'Opinion' ? 'Opinion Source' : 'Unknown',
                    category: 'Opinion',
                    subcategory: 'Opinion',
                    published_at: new Date().toISOString(),
                    original_title: item.title
                }, { onConflict: 'url' });

                if (error) console.error("Upsert Error:", error);
                else console.log("Upserted!");

                // Delay 1s
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // Delay 2s between feeds
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.error(`Feed Error ${feed.url}:`, e);
        }
    }
    console.log("Done!");
}

run();
