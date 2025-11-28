import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Using gemini-1.5-flash for speed and cost efficiency
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeText(text: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set. Skipping summarization.");
        return text.substring(0, 200) + "..."; // Fallback
    }

    try {
        const prompt = `Summarize the following news article in a concise, engaging way. Focus on the key facts and context. Use bullet points if appropriate. Keep it under 150 words.\n\n${text}`;
        const result = await model.generateContent(prompt);
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
        const prompt = `Translate the following text to ${targetLanguage === 'hi' ? 'Hindi' : 'English'}. Maintain the tone and style of a news article. Output ONLY the translated text.\n\n${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error translating text:", error);
        return text; // Fallback
    }
}
