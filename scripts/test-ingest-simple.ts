import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

const parser = new Parser();

async function run() {
    const feedUrl = process.argv[2] || 'https://www.theguardian.com/uk/commentisfree/rss';
    console.log(`Testing Parser + Upsert for ${feedUrl}...`);

    try {
        const feed = await parser.parseURL(feedUrl);
        console.log(`Parsed feed: ${feed.title}`);

        const item = feed.items[0];
        if (item) {
            console.log(`Upserting: ${item.title}`);
            const { error } = await supabase.from('articles').upsert({
                title: item.title,
                url: item.link,
                summary: item.contentSnippet?.substring(0, 200),
                content: item.content,
                source: "Test Script",
                category: "Opinion",
                subcategory: "Opinion",
                published_at: new Date().toISOString()
            }, { onConflict: 'url' });

            if (error) console.error("Upsert Error:", error);
            else console.log("Upsert Successful!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
