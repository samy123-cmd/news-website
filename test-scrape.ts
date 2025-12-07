import { scrapeArticleContent } from './src/lib/ingest';

async function test() {
    const url = 'https://www.bbc.com/news/articles/cly21188888o'; // Example BBC article
    console.log(`Scraping ${url}...`);
    const content = await scrapeArticleContent(url);
    console.log(`Scraped length: ${content.length}`);
    console.log(`Preview: ${content.substring(0, 200)}...`);
}

test();
