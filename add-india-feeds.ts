import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const newFeeds = [
    // English Feeds
    {
        name: "Times of India",
        url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
        category: "India",
        active: true
    },
    {
        name: "NDTV Top Stories",
        url: "https://feeds.feedburner.com/ndtvnews-top-stories",
        category: "India",
        active: true
    },
    {
        name: "The Hindu",
        url: "https://www.thehindu.com/news/national/feeder/default.rss",
        category: "India",
        active: true
    },
    // Hindi Feeds
    {
        name: "Dainik Jagran (Hindi)",
        url: "https://rss.jagran.com/rss/news/national.xml",
        category: "India",
        active: true
    },
    {
        name: "NDTV India (Hindi)",
        url: "https://feeds.feedburner.com/ndtvkhabar",
        category: "India",
        active: true
    },
    {
        name: "Amar Ujala (Hindi)",
        url: "https://www.amarujala.com/rss/breaking-news.xml",
        category: "India",
        active: true
    }
];

async function addFeeds() {
    console.log("Adding Indian news feeds...");

    for (const feed of newFeeds) {
        const { error } = await supabase
            .from('feeds')
            .upsert(feed, { onConflict: 'url' });

        if (error) {
            console.error(`Error adding ${feed.name}:`, error);
        } else {
            console.log(`Added/Updated: ${feed.name}`);
        }
    }

    console.log("Done!");
}

addFeeds();
