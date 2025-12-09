import { stripHtml } from "./text";

const KEYWORDS_TO_TOPICS: Record<string, string> = {
    "Nvidia": "nvidia",
    "OpenAI": "openai",
    "Google": "google",
    "Microsoft": "microsoft",
    "Apple": "apple",
    "Meta": "meta",
    "Artificial Intelligence": "artificial-intelligence",
    "Machine Learning": "machine-learning",
    "Deep Learning": "deep-learning",
    "Generative AI": "generative-ai",
    "LLM": "large-language-model",
    "ChatGPT": "chatgpt",
    "Jensen Huang": "jensen-huang",
    "Sam Altman": "sam-altman",
    "Elon Musk": "elon-musk",
    "SpaceX": "spacex",
    "Tesla": "tesla",
    "Anthropic": "anthropic",
    "Claude": "claude",
    "Gemini": "gemini",
};

/**
 * Scans the content for keywords and wraps them in links to /topic/[slug].
 * Uses a simple replace strategy but avoids replacing inside existing tags.
 */
export function linkKeywords(htmlContent: string): string {
    let linkedContent = htmlContent;

    // Sort keywords by length descending to match longest phrases first
    const keywords = Object.keys(KEYWORDS_TO_TOPICS).sort((a, b) => b.length - a.length);

    // We only want to link the FIRST occurrence of each keyword to avoid spamminess
    // and we must be careful not to break existing HTML attributes (e.g. alt="Nvidia logo")

    // A robust way without a DOM parser is hard, but we can do a safe pass on text nodes if we had DOM.
    // For server-side string manipulation, we can try a regex that asserts we are not inside a tag.
    // Regex: /Keyword(?![^<]*>)/g  <-- Checks strictly if not followed by closing > without opening <

    keywords.forEach(keyword => {
        const slug = KEYWORDS_TO_TOPICS[keyword];
        const url = `/topic/${slug}`;
        const link = `<a href="${url}" class="text-primary hover:underline font-medium">${keyword}</a>`;

        // Regex explanation:
        // \b${keyword}\b : Whole word match
        // (?![^<]*>) : Lookahead to ensure we are not inside an HTML tag (heuristically)
        // (?!<\/a>) : Don't link if already inside an anchor (nested links are illegal) - hard to detect with simple regex

        // Simpler approach: 
        // 1. Replace only the first occurrence to minimize risk and spam.
        // 2. Use a heuristic that is "good enough" for polished HTML which is usually clean <p> paragraphs.

        const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, 'i'); // Case insensitive match for first find

        // Find match to preserve original casing in text but use our link
        const match = linkedContent.match(regex);
        if (match) {
            // Replace ONLY the first one
            linkedContent = linkedContent.replace(regex, (matched) => {
                return `<a href="${url}" class="text-primary hover:underline font-medium">${matched}</a>`;
            });
        }
    });

    return linkedContent;
}
