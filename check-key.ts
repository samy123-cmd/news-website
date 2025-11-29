import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const key = process.env.GEMINI_API_KEY;

console.log("--- API Key Debug ---");
if (!key) {
    console.error("❌ GEMINI_API_KEY is undefined or empty.");
} else {
    console.log(`✅ Found key with length: ${key.length}`);
    console.log(`Starts with: ${key.substring(0, 4)}...`);
    if (!key.startsWith("AIza")) {
        console.warn("⚠️ Warning: Google API keys usually start with 'AIza'. Check your key.");
    } else {
        console.log("Looks like a valid Google API key format.");
    }
}
console.log("---------------------");
