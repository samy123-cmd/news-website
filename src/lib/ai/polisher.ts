import { GoogleGenerativeAI } from "@google/generative-ai";

interface PolishedContent {
    headline: string;
    summary: string;
    content: string;
    category: string;
    subcategory: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    readTime: string;
    tags?: string[];
    curation_note?: string;
}

export async function polishContent(text: string, originalHeadline: string): Promise<PolishedContent> {
    if (!process.env.GEMINI_API_KEY) {
        // Fallback for dev without keys
        return {
            headline: originalHeadline,
            summary: text.substring(0, 200) + "...",
            content: `<p>${text}</p>`,
            category: "General",
            subcategory: "News",
            sentiment: "neutral",
            readTime: "1 min",
            tags: [],
            curation_note: "Content gathered from raw feed."
        };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // List of models to try in order of preference
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-8b"
    ];

    let lastError;

    for (const modelName of modelsToTry) {
        try {
            // if (process.env.NODE_ENV === 'development') console.log(`[Content Polisher] Attempting with model: ${modelName}`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });

            const MAX_RETRIES = 3;
            let attempt = 0;

            // Retry Loop for Rate Limits (429) & Model Errors
            while (attempt < MAX_RETRIES) {
                try {
                    const prompt = `
                    Act as a senior editor for a premium news agency. 
                    Structure the output as a valid JSON object.
                    Input Headline: "${originalHeadline}"
                    Input Text: "${text.substring(0, 8000)}"

                    1. Refine Headline (Max 15 words)
                    2. Summarize (Max 150 words)
                    3. Write Article (400-600 words, HTML format <h3>, <p>, <ul>)
                    4. Category: [World, Politics, Business, Technology, Sports, Entertainment, Science, Opinion, India]
                    5. Subcategory, Sentiment, ReadTime.
                    6. Tags: Array of 3-5 specific entities (e.g. ["Nvidia", "Jensen Huang", "AI Chips"])
                    7. Curation Note: A 1-sentence explanation of why this story matters (e.g. "Selected because valid regulatory approval significantly impacts the AI hardware market.")

                    Output JSON ONLY.
                    `;

                    // Add timeout for AI generation (30s)
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error("AI generation timeout")), 30000)
                    );

                    const result = await Promise.race([
                        model.generateContent(prompt),
                        timeoutPromise
                    ]) as any;

                    const response = await result.response;
                    let jsonString = response.text();

                    // Robust JSON extraction
                    const firstOpen = jsonString.indexOf('{');
                    const lastClose = jsonString.lastIndexOf('}');
                    if (firstOpen !== -1 && lastClose !== -1) {
                        jsonString = jsonString.substring(firstOpen, lastClose + 1);
                    }

                    // Attempt parsing
                    let polishedData;
                    try {
                        polishedData = JSON.parse(jsonString);
                    } catch (initialError) {
                        // Simple cleanup attempt
                        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").replace(/\\n/g, "\\n");
                        polishedData = JSON.parse(jsonString);
                    }

                    // If success, return immediately
                    return polishedData;

                } catch (error: any) {
                    const isRateLimit = error.message?.includes('429') || error.status === 429 || error.toString().includes('429');

                    if (isRateLimit) {
                        attempt++;
                        if (attempt < MAX_RETRIES) {
                            const waitTime = attempt * 10000; // 10s, 20s
                            console.warn(`[Content Polisher] 429 Rate Limit on ${modelName}. Retry ${attempt}...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                            continue;
                        }
                    }

                    // Check for 404 (Model Not Found) - Break inner loop to try next model
                    const isNotFound = error.message?.includes('404') || error.status === 404 || error.toString().includes('Not Found');
                    if (isNotFound) {
                        throw error; // Throw to outer loop to trigger model switch
                    }

                    // Other errors? Break inner loop, maybe try next model or just fail
                    throw error;
                }
                break;
            }
        } catch (e: any) {
            lastError = e;
            const isNotFound = e.message?.includes('404') || e.status === 404 || e.toString().includes('Not Found');
            if (isNotFound) {
                console.warn(`[Content Polisher] Model ${modelName} not found used. Trying next...`);
                continue; // Try next model in list
            }
            // If it's a non-404 error (like strict parsing or timeout) and we exhausted retries,
            // we could try the next model just in case the model itself is buggy/slow.
            console.warn(`[Content Polisher] Issue with ${modelName}: ${e.message}. Trying next...`);
            continue;
        }
    }

    console.error(`[Content Polisher] All models failed. Last error:`, lastError);

    // Final Fallback if ALL models fail
    return {
        headline: originalHeadline,
        summary: text.substring(0, 200) + "...",
        content: `<p>${text}</p><div class="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg my-4 text-yellow-200 text-sm"><p><strong>Note:</strong> AI processing unavailable currently. Displaying raw content.</p></div>`,
        category: "General",
        subcategory: "News",
        sentiment: "neutral",
        readTime: "1 min",
        tags: [],
        curation_note: "AI service unavailable."
    };
}
