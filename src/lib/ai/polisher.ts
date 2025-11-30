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
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    try {
        const prompt = `
      Act as a senior editor for a premium news agency (like BBC/CNN/Reuters). 
      Your task is to "polish" the following news content into a high-quality, engaging article.
      
      Input Headline: "${originalHeadline}"
      Input Text: "${text}"

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

      Output JSON ONLY. Ensure all strings are properly escaped to be valid JSON.
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text();

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
