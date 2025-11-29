import { scrapeTrends } from '../src/lib/trends';

async function testTrends() {
    console.log("Testing Twitter Trends Scraper...");

    console.log("\nFetching Global Trends...");
    const globalTrends = await scrapeTrends('global');
    console.log(`Fetched ${globalTrends.length} global trends.`);
    if (globalTrends.length > 0) {
        console.log("First global trend:", globalTrends[0]);
    } else {
        console.error("No global trends found!");
    }

    console.log("\nFetching Local (India) Trends...");
    const localTrends = await scrapeTrends('local');
    console.log(`Fetched ${localTrends.length} local trends.`);
    if (localTrends.length > 0) {
        console.log("First local trend:", localTrends[0]);
    } else {
        console.error("No local trends found!");
    }
}

testTrends().catch(console.error);
