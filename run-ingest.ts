import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ingestNews } from './src/lib/news/ingest';

async function runIngest() {
    console.log('Starting ingest with AI polishing...');
    console.log('GEMINI_API_KEY set:', !!process.env.GEMINI_API_KEY);

    try {
        const results = await ingestNews(2); // Ingest 2 feeds with AI polishing
        console.log('Ingested articles:', results);
    } catch (error) {
        console.error('Ingest failed:', error);
    }
}

runIngest();
