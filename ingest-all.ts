import * as dotenv from 'dotenv';

// Load env vars BEFORE importing anything that uses them
dotenv.config({ path: '.env.local' });

async function run() {
    console.log("Starting full ingestion script...");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing Supabase credentials in .env.local");
        process.exit(1);
    }

    try {
        // Dynamic import to ensure env vars are loaded first
        const { ingestNews } = await import('./src/lib/news/ingest');

        // Get category from command line args (e.g., "Entertainment")
        const category = process.argv[2];

        // Run full ingestion (limit: -1) with optional category
        const results = await ingestNews(-1, category);
        console.log(`Ingestion complete! Processed ${results.length} articles.`);
        process.exit(0);
    } catch (error) {
        console.error("Ingestion failed:", error);
        process.exit(1);
    }
}

run();
