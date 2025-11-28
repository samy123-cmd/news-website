import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    try {
        const prompt = `
      Act as a senior editor for a premium news agency (like BBC/CNN). 
      Your task is to "polish" the following news content.
      
      Input Headline: "${originalHeadline}"
      Input Text: "${text}"

      1. **Refine the Headline**: Make it punchy, professional, and SEO-friendly.
      2. **Summarize**: Create a "Key Takeaways" style summary (max 150 words).
      3. **Write Article**: Write a detailed, engaging, and comprehensive news article (at least 400-600 words) based on the input. Use HTML formatting (<h3> for subheadings, <p> for paragraphs, <ul>/<li> for lists). Do NOT use <h1> or <h2>. Make it sound authoritative and premium.
      4. **Categorize**: Assign a main Category (e.g., World, Politics, Business, Tech, Sports, Entertainment, Science) and a specific Subcategory (e.g., Cricket, AI, Bollywood, Elections).
      5. **Analyze**: Determine sentiment and estimate read time.

      Output JSON ONLY:
      {
        "headline": "...",
        "summary": "...",
        "content": "...",
        "category": "...",
        "subcategory": "...",
        "sentiment": "positive|neutral|negative",
        "readTime": "X min"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error polishing content:", error);
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
}
