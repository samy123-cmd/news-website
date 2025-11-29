import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const SEED_FEEDS = [
    { url: "http://feeds.bbci.co.uk/news/politics/rss.xml", category: "politics", name: "BBC Politics" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", category: "politics", name: "NYT Politics" },
    { url: "https://techcrunch.com/feed/", category: "technology", name: "TechCrunch" },
    { url: "https://www.theverge.com/rss/index.xml", category: "technology", name: "The Verge" },
    { url: "https://www.espn.com/espn/rss/news", category: "sports", name: "ESPN" },
    { url: "http://feeds.bbci.co.uk/sport/rss.xml", category: "sports", name: "BBC Sport" },
    { url: "https://www.hollywoodreporter.com/feed/", category: "entertainment", name: "Hollywood Reporter" },
    { url: "https://variety.com/feed/", category: "entertainment", name: "Variety" }
];

async function seed() {
    console.log("Seeding feeds...");

    for (const feed of SEED_FEEDS) {
        const { error } = await supabase
            .from('feeds')
            .upsert({
                url: feed.url,
                category: feed.category,
                name: feed.name,
                active: true
            }, { onConflict: 'url' });

        if (error) {
            console.error(`Failed to seed ${feed.name}:`, error);
        } else {
            console.log(`Seeded ${feed.name}`);
        }
    }
    console.log("Done!");
}

seed();
