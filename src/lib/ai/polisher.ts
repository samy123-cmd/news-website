import { GoogleGenerativeAI } from "@google/generative-ai";

interface PolishedContent {
    headline: string;
    summary: string;
    content: string;
    category: string;
    subcategory: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    readTime: string;
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
            readTime: "1 min"
        };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-001",
        generationConfig: { responseMimeType: "application/json" }
    });

    const MAX_RETRIES = 3;
    let attempt = 0;

    // Retry Loop for Rate Limits (429)
    while (attempt < MAX_RETRIES) {
        try {
            const prompt = `
      Act as a senior editor for a premium news agency (like BBC/CNN/Reuters). 
      Your task is to "polish" the following news content into a high-quality, engaging article.
      
      Input Headline: "${originalHeadline}"
      Input Text: "${text}"

      IMPORTANT: If the Input Text is short (e.g., just a summary or snippet), you MUST expand upon it significantly using your general knowledge and context about the topic to create a full-length article. Do not just repeat the input.

      1. **Refine the Headline**: Create a compelling, click-worthy, yet credible headline. Avoid clickbait, but make it intriguing. Max 15 words.
      2. **Summarize**: Create a "Key Takeaways" style summary (bullet points preferred, max 150 words).
      3. **Write Article**: Write a detailed, engaging, and comprehensive news article (at least 400-600 words). 
         - Use HTML formatting: <h3> for subheadings, <p> for paragraphs, <ul>/<li> for lists. 
         - Do NOT use <h1> or <h2>. 
         - Adopt a neutral, authoritative, yet accessible tone.
         - **LANGUAGE RULE**: If the input text is in Hindi, the output (Headline, Summary, Article) MUST be in Hindi. Do NOT translate Hindi inputs to English.
      4. **Categorize**: Assign a main Category from this EXACT list: [World, Politics, Business, Technology, Sports, Entertainment, Science, Opinion, India]. 
         - If it's specifically about Indian national news, politics, or events, use "India".
         - If it's about space/nature/discovery, use "Science".
         - If it's a review/gadget/software, use "Technology".
         - If it's a movie/celebrity, use "Entertainment".
         - If it's a match/player, use "Sports".
         - If it's an editorial/commentary, use "Opinion".
         - ONLY use "General" if it absolutely fits none of the above.
      5. **Subcategory**: Choose a specific, relevant subcategory (e.g., AI, Space, Cricket, Hollywood, Elections, Markets).
      6. **Analyze**: Determine sentiment (positive/neutral/negative) and estimate read time (e.g., "4 min").

      Output JSON ONLY. Do NOT use markdown code blocks. 
      IMPORTANT: Ensure all double quotes inside strings are properly escaped (e.g., \"text\"). 
      Do not include any trailing commas.
      {
        "headline": "...",
        "summary": "...",
        "content": "...",
        "category": "...",
        "subcategory": "...",
        "sentiment": "...",
        "readTime": "..."
      }
    `;

            // Add timeout for AI generation (25s)
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("AI generation timeout")), 25000)
            );

            const result = await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]) as any;

            const response = await result.response;
            let jsonString = response.text();

            // Robust JSON extraction: Find the first '{' and the last '}'
            const firstOpen = jsonString.indexOf('{');
            const lastClose = jsonString.lastIndexOf('}');

            if (firstOpen !== -1 && lastClose !== -1) {
                jsonString = jsonString.substring(firstOpen, lastClose + 1);
            }

            try {
                return JSON.parse(jsonString);
            } catch (initialError) {
                console.warn("Initial JSON parse failed, attempting cleanup...", initialError);
                // Attempt to fix common JSON issues
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "");
                jsonString = jsonString.replace(/\\n/g, "\\n").replace(/\\r/g, ""); // Basic escape check

                try {
                    return JSON.parse(jsonString);
                } catch (retryError) {
                    console.error("Failed to parse JSON after cleanup:", jsonString.substring(0, 200) + "...");
                    throw retryError;
                }
            }

        } catch (error: any) {
            // Graceful Rate Limit Handling
            const isRateLimit = error.message?.includes('429') || error.status === 429 || error.toString().includes('429');

            if (isRateLimit) {
                attempt++;
                if (attempt < MAX_RETRIES) {
                    // Exponential backoff or specific delay (45s, then 60s, then 90s)
                    const waitTime = attempt * 45000;
                    console.warn(`[Content Polisher] 429 Rate Limit hit for "${originalHeadline}". Waiting ${waitTime / 1000}s before retry ${attempt}/${MAX_RETRIES}...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue; // Retry logic
                } else {
                    console.error(`[Content Polisher] Max retries exhausted for "${originalHeadline}". Using fallback.`);
                }
            } else {
                console.error("Error polishing content (Non-429):", error);
                // If it's not a rate limit, usually we break and return fallback
                break;
            }
        }

        // If we succeeded (return inside try), we don't reach here.
        // If we failed (caught error) and didn't continue, we reach here.
        break;
    }

    // Fallback Return
    return {
        headline: originalHeadline,
        summary: text.substring(0, 200) + "...",
        content: `<p>${text}</p><div class="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg my-4 text-yellow-200 text-sm"><p><strong>Note:</strong> Our AI editors are currently at maximum capacity. This article is displayed in its raw format and will be polished automatically when capacity frees up.</p></div>`,
        category: "General",
        subcategory: "News",
        sentiment: "neutral",
        readTime: "1 min"
    };
}
