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

const SCIENCE_FEEDS = [
    { name: 'ScienceDaily - Top News', url: 'https://www.sciencedaily.com/rss/top/science.xml', category: 'Science' },
    { name: 'NASA Breaking News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', category: 'Science' },
    { name: 'EurekAlert! Science News', url: 'https://www.eurekalert.org/rss/technology_engineering.xml', category: 'Science' },
    { name: 'Phys.org - Spotlight', url: 'https://phys.org/rss-feed/spotlight/', category: 'Science' },
    { name: 'New Scientist', url: 'https://www.newscientist.com/feed/home/', category: 'Science' }
];

async function inject() {
    console.log("Injecting Science feeds...");

    for (const feed of SCIENCE_FEEDS) {
        const { error } = await supabase
            .from('feeds')
            .upsert({
                name: feed.name,
                url: feed.url,
                category: feed.category,
                active: true
            }, { onConflict: 'url' });

        if (error) {
            console.error(`Failed to insert ${feed.name}:`, error.message);
        } else {
            console.log(`Inserted/Updated: ${feed.name}`);
        }
    }
    console.log("Done.");
}

inject();
