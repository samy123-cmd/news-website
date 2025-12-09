
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("Error: GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

console.log("Using API Key:", key.substring(0, 8) + "...");

const genAI = new GoogleGenerativeAI(key);

async function list() {
    try {
        // There isn't a direct listModels method on the client instance in some versions,
        // but let's try a simple generation to see if 1.5 flash works.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Attempting generation with gemini-1.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        console.log("Success! Response:", result.response.text());
    } catch (e: any) {
        console.error("Failed with gemini-1.5-flash:", e.message);

        console.log("\nTrying gemini-pro...");
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Hello?");
            console.log("Success with gemini-pro! Response:", result2.response.text());
        } catch (e2: any) {
            console.error("Failed with gemini-pro:", e2.message);
        }
    }
}

list();
