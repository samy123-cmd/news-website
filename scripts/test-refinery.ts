import { fetchNewsByCategory } from '../src/lib/ingest';

async function testRefinery() {
    console.log("Testing Refinery Ingestion...");

    const categories = ['technology', 'politics'];

    for (const category of categories) {
        console.log(`\nFetching ${category} news...`);
        const news = await fetchNewsByCategory(category);
        console.log(`Fetched ${news.length} articles.`);
        if (news.length > 0) {
            console.log("First article sample:");
            console.log(JSON.stringify(news[0], null, 2));
        } else {
            console.error(`No news found for ${category}!`);
        }
    }
}

testRefinery().catch(console.error);
