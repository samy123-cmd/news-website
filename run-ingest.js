// Load env FIRST before any imports
require('dotenv').config({ path: '.env.local' });

const { ingestNews } = require('./src/lib/news/ingest');

async function runIngest() {
    console.log('Starting ingest with AI polishing...');
    console.log('SUPABASE_URL set:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('GEMINI_API_KEY set:', !!process.env.GEMINI_API_KEY);

    try {
        const results = await ingestNews(2); // Ingest 2 feeds with AI polishing
        console.log('Ingested', results.length, 'articles');
        console.log('Articles:', results);
    } catch (error) {
        console.error('Ingest failed:', error);
    }
}

runIngest();
