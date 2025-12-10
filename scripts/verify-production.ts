
import { ingestNews } from '../src/lib/news/ingest';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runVerify() {
    console.log("=== FINAL STAGING VERIFICATION ===");
    const start = Date.now();

    // Run 1: Limit 1 to check fallback and basic flow
    console.log("\n[Run 1] Executing Ingestion (Limit: 1)...");
    const stats1 = await ingestNews({ limit: 1, maxTimeMs: 60000 });

    console.log("\n[Run 1] Stats:");
    console.log(JSON.stringify(stats1, null, 2));

    if (stats1.errors > 0) {
        console.error("!! Run 1 FAILED with errors !!");
        process.exit(1);
    }

    console.log("\n[Final Report]");
    console.log(`Total Runtime: ${Date.now() - start}ms`);
    console.log(`Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    console.log(`Fallback Percentage: ${stats1.articlesProcessed > 0 ? (stats1.articlesFallback / stats1.articlesProcessed * 100).toFixed(1) : 0}%`);

    console.log("=== VERIFICATION COMPLETE ===");
}

runVerify().catch(e => {
    console.error(e);
    process.exit(1);
});
