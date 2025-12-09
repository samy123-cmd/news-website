
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    try {
        // Access the model list via the efficient `unstable_listModels` or standard getModel if available.
        // The SDK exposes listModels differently. Let's try to infer from a generic request or known method.
        // Actually, standard SDK usage doesn't always expose listModels easily in the simplified client.
        // We will try a different approach: fetch from REST API directly using the key.

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("No API Key found!");
            return;
        }

        console.log("Fetching models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods?.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models returned.", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
