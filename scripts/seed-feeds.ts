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

const ALL_FEEDS = [
    // Science
    { name: 'ScienceDaily - Top News', url: 'https://www.sciencedaily.com/rss/top/science.xml', category: 'Science' },
    { name: 'NASA Breaking News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', category: 'Science' },
    { name: 'EurekAlert! Science News', url: 'https://www.eurekalert.org/rss/technology_engineering.xml', category: 'Science' },
    { name: 'Phys.org - Spotlight', url: 'https://phys.org/rss-feed/spotlight/', category: 'Science' },
    { name: 'New Scientist', url: 'https://www.newscientist.com/feed/home/', category: 'Science' },

    // Opinion
    { name: 'The Guardian - Opinion', url: 'https://www.theguardian.com/uk/commentisfree/rss', category: 'Opinion' },
    { name: 'SCMP - Opinion', url: 'https://www.scmp.com/rss/91/feed', category: 'Opinion' },
    { name: 'Project Syndicate', url: 'https://www.project-syndicate.org/rss', category: 'Opinion' },

    // World
    { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World' },

    // Business
    { name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    { name: 'CNBC', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', category: 'Business' },

    // Tech
    { name: 'BBC Tech', url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { name: 'TechCrunch', url: 'https://feeds.feedburner.com/TechCrunch/', category: 'Technology' },

    // Entertainment
    { name: 'BBC Entertainment', url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment' },
    { name: 'E! Online', url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', category: 'Entertainment' },

    // Sports
    { name: 'BBC Sports', url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports' },
    { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', category: 'Sports' }
];

async function seed() {
    console.log("Seeding feeds...");

    for (const feed of ALL_FEEDS) {
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
            console.log(`Inserted/Updated: ${feed.name} [${feed.category}]`);
        }
    }
    console.log("Done seeding.");
}

seed();
