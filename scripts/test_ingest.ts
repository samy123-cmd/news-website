
import { ingestNews } from '../src/lib/news/ingest';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    console.log("Running test ingest with limit 2...");
    try {
        const stats = await ingestNews({ limit: 2, maxTimeMs: 60000 });
        console.log("Ingest complete:", stats);
    } catch (e: any) {
        console.error("Ingest failed:", e);
        const fs = require('fs');
        fs.writeFileSync('error_log.txt', JSON.stringify({ message: e.message, stack: e.stack, details: e.details }, null, 2));
    }
}

run();
