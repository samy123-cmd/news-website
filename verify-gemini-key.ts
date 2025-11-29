import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

async function verify() {
    console.log("--- Listing Available Models ---");
    if (!API_KEY) {
        console.error("❌ No API Key found.");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log("✅ API Key is VALID! Here are your available models:");
            const models = data.models || [];
            const modelNames = models.map((m: any) => m.name.replace('models/', ''));
            console.log(modelNames.join(', '));

            console.log("\n--- Testing 'gemini-2.0-flash' generation ---");
            await testModel('gemini-2.0-flash');
        } else {
            console.error("❌ Failed to list models. Key might be invalid.");
            console.error("Status:", response.status);
            console.error("Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("❌ Network Error:", e);
    }
}

async function testModel(modelName: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text: "Hi" }] }] };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        console.log(`✅ Success! '${modelName}' is working.`);
    } else {
        console.log(`❌ '${modelName}' failed: ${response.status}`);
        const data = await response.json();
        console.log("Error:", JSON.stringify(data, null, 2));
    }
}

verify();
