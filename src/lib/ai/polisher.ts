import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPreferredModel, validateApiKey } from "./validateApiKey";
import { acquireToken, recordSuccess, recordFailure, waitForBackoff } from "./rateLimiter";

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
    ai_processed?: boolean;
}

// Fallback response when AI is unavailable
function createFallbackResponse(text: string, originalHeadline: string, reason: string): PolishedContent {
    return {
        headline: originalHeadline,
        summary: text.substring(0, 200) + "...",
        content: `<p>${text}</p>`,
        category: "General",
        subcategory: "News",
        sentiment: "neutral",
        readTime: "1 min",
        tags: [],
        curation_note: null as any, // Null = hide section in UI
        ai_processed: false
    };
}

export async function polishContent(text: string, originalHeadline: string): Promise<PolishedContent> {
    // Step 1: Validate API key and get preferred model
    const validation = await validateApiKey();

    if (!validation.isValid || !validation.preferredModel) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[Content Polisher] AI disabled: ${validation.error}`);
        }
        return createFallbackResponse(text, originalHeadline, validation.error || "No API key");
    }

    // Step 2: Acquire rate limit token
    const canProceed = await acquireToken();
    if (!canProceed) {
        console.warn(`[Content Polisher] Rate limit exceeded. Skipping AI polish.`);
        return createFallbackResponse(text, originalHeadline, "Rate limit");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Build model list: preferred first, then fallbacks
    const modelsToTry = [
        validation.preferredModel,
        ...validation.availableModels
            .map(m => m.name)
            .filter(n => n !== validation.preferredModel)
            .slice(0, 2) // Max 2 additional fallbacks
    ];

    let lastError: any;
    const MAX_RETRIES = 2;

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });

            let attempt = 0;

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

                    // 30s timeout
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error("AI generation timeout")), 30000)
                    );

                    const result = await Promise.race([
                        model.generateContent(prompt),
                        timeoutPromise
                    ]) as any;

                    const response = await result.response;
                    let jsonString = response.text();

                    // Extract JSON
                    const firstOpen = jsonString.indexOf('{');
                    const lastClose = jsonString.lastIndexOf('}');
                    if (firstOpen !== -1 && lastClose !== -1) {
                        jsonString = jsonString.substring(firstOpen, lastClose + 1);
                    }

                    // Parse JSON
                    let polishedData;
                    try {
                        polishedData = JSON.parse(jsonString);
                    } catch {
                        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "");
                        polishedData = JSON.parse(jsonString);
                    }

                    // Mark as AI processed
                    polishedData.ai_processed = true;

                    // Record success for rate limiter
                    recordSuccess();

                    return polishedData;

                } catch (error: any) {
                    const isRateLimit = error.message?.includes('429') || error.status === 429;

                    if (isRateLimit) {
                        attempt++;
                        if (attempt < MAX_RETRIES) {
                            await waitForBackoff();
                            continue;
                        }
                    }

                    // 404 = try next model
                    const isNotFound = error.message?.includes('404') || error.status === 404;
                    if (isNotFound) {
                        throw error;
                    }

                    throw error;
                }
            }
        } catch (e: any) {
            lastError = e;
            recordFailure();

            const isNotFound = e.message?.includes('404') || e.status === 404;
            if (isNotFound) {
                continue; // Try next model
            }

            // For other errors, try next model
            continue;
        }
    }

    // All models failed
    if (process.env.NODE_ENV === 'development') {
        console.warn(`[Content Polisher] All models failed. Last: ${lastError?.message}`);
    }

    return createFallbackResponse(text, originalHeadline, lastError?.message || "Unknown error");
}
