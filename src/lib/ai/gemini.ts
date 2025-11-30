import { GoogleGenerativeAI } from "@google/generative-ai";



export async function summarizeText(text: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set. Skipping summarization.");
        return text.substring(0, 200) + "..."; // Fallback
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Summarize the following news article in a concise, engaging way. Focus on the key facts and context. Use bullet points if appropriate. Keep it under 150 words.\n\n${text}`;
        // Add timeout for AI generation
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timeout")), 10000)
        );

        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]) as any;

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error summarizing text:", error);
        return text.substring(0, 200) + "..."; // Fallback
    }
}

export async function translateText(text: string, targetLanguage: 'hi' | 'en'): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set. Skipping translation.");
        return text; // Fallback
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Translate the following text to ${targetLanguage === 'hi' ? 'Hindi' : 'English'}. Maintain the tone and style of a news article. Output ONLY the translated text.\n\n${text}`;
        // Add timeout for AI generation
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timeout")), 10000)
        );

        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]) as any;

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error translating text:", error);
        return text; // Fallback
    }
}
