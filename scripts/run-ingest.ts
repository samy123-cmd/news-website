
import { ingestNews } from '../src/lib/news/ingest';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load Environment Variables
// Ensure .env.local exists with SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.warn("⚠️  Warning: .env.local not found at", envPath);
    console.warn("   Make sure you have set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY.");
}

async function runLocalIngest() {
    console.log("==========================================");
    console.log("   LOCAL INGESTION PIPELINE (MANUAL RUN)");
    console.log("==========================================");

    const start = Date.now();

    // 2. Trigger Ingestion
    // We set maxTimeMs to 60s to mimic Vercel, or you can set it higher (e.g., 300000) for a "long run"
    const TIMEOUT_MS = 60000;

    try {
        console.log(`\n🚀 Starting ingestion... (Budget: ${TIMEOUT_MS}ms)`);

        const stats = await ingestNews({
            limit: -1, // Process ALL new articles found
            maxTimeMs: TIMEOUT_MS
        });

        console.log("\n✅ Ingestion Complete!");
        console.log("------------------------------------------");
        console.log("📊 Final Stats:");
        console.log(JSON.stringify(stats, null, 2));
        console.log("------------------------------------------");
        console.log(`⏱️  Total Runtime: ${(Date.now() - start) / 1000}s`);
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Fatal Error during local ingest:", error);
        process.exit(1);
    }
}

// Execute
runLocalIngest();
