import { polishContent } from './src/lib/ai/polisher';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function runAndSave() {
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
        console.log("Polished!");
        fs.writeFileSync('polisher_result.json', JSON.stringify(result, null, 2));
        console.log("Saved to polisher_result.json");
    } catch (e) {
        console.error(e);
    }
}

runAndSave();
