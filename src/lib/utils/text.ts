
/**
 * Strips HTML tags from a string and returns plain text.
 * Replaces </li> with a period and space to separate list items.
 * Replaces <br> with a newline.
 */
export function stripHtml(html: string): string {
    if (!html) return "";

    // Replace list item endings with a period and space
    let text = html.replace(/<\/li>/gi, ". ");

    // Replace <br> with newline
    text = text.replace(/<br\s*\/?>/gi, "\n");

    // Strip all other tags
    text = text.replace(/<[^>]+>/g, "");

    // Decode HTML entities (basic ones)
    text = text.replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Clean up extra whitespace
    text = text.replace(/\s+/g, " ").trim();

    return text;
}
