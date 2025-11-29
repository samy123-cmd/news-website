const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

const articles = [
    {
        title: "NASA's New Telescope Finds Earth-Like Planet",
        summary: "A new exoplanet with potential for liquid water has been discovered by NASA's latest space telescope.",
        category: "Science",
        subcategory: "Space",
        url: "https://nasa.gov/new-planet-" + Date.now(),
        image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Breakthrough in Fusion Energy Announced",
        summary: "Scientists have achieved a net energy gain in a fusion reaction, marking a major milestone for clean energy.",
        category: "Science",
        subcategory: "Physics",
        url: "https://science.org/fusion-breakthrough-" + Date.now(),
        image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "New Species of Deep Sea Jellyfish Discovered",
        summary: "Marine biologists have identified a bioluminescent jellyfish in the Mariana Trench.",
        category: "Science",
        subcategory: "Biology",
        url: "https://nature.com/jellyfish-" + Date.now(),
        image_url: "https://images.unsplash.com/photo-1551726197-8d829432617a?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "AI Solves 50-Year-Old Biology Problem",
        summary: "DeepMind's AlphaFold has predicted the structure of nearly all known proteins.",
        category: "Science",
        subcategory: "Technology",
        url: "https://deepmind.com/alphafold-" + Date.now(),
        image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Climate Change: Ice Sheets Melting Faster Than Expected",
        summary: "New satellite data reveals accelerating ice loss in Greenland and Antarctica.",
        category: "Science",
        subcategory: "Environment",
        url: "https://climate.gov/ice-melt-" + Date.now(),
        image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    }
];

async function run() {
    console.log("Injecting Science Articles (JS)...");

    for (const article of articles) {
        const { error } = await supabase.from('articles').upsert({
            ...article,
            source: "Science Daily",
            published_at: new Date().toISOString(),
            content: article.summary + " Full content would go here.",
            sentiment: "Neutral",
            read_time: 5
        }, { onConflict: 'url' });

        if (error) console.error("Error:", error);
        else console.log(`Inserted: ${article.title}`);
    }
}

run();
