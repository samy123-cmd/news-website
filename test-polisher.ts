import { polishContent } from './src/lib/ai/polisher';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
    console.log("Testing AI Polisher...");

    const sampleText = `
        SpaceX has successfully launched another batch of Starlink satellites into orbit. 
        The Falcon 9 rocket lifted off from Cape Canaveral on Tuesday morning. 
        This mission marks the 50th launch of the year for the company. 
        Elon Musk tweeted that the deployment was successful. 
        Astronomers have raised concerns about the brightness of these satellites affecting observations.
    `;
    const sampleHeadline = "SpaceX launches more Starlink satellites";

    try {
        const result = await polishContent(sampleText, sampleHeadline);
        console.log("--- Polished Result ---");
        console.log(JSON.stringify(result, null, 2));

        if (result.category === 'Science' || result.category === 'Technology') {
            console.log("SUCCESS: Category correctly identified.");
        } else {
            console.warn(`WARNING: Unexpected category: ${result.category}`);
        }

    } catch (e) {
        console.error("Polisher Failed:", e);
    }
}

run();
