import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import DOMPurify from 'isomorphic-dompurify';

export interface ScrapedArticle {
    content: string;
    textContent: string;
    images: string[];
    byline?: string;
    siteName?: string;
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.statusText}`);
            return null;
        }

        const html = await response.text();
        const dom = new JSDOM(html, { url });
        const document = dom.window.document;

        // Extract all images before Readability potentially removes them
        const imageElements = Array.from(document.querySelectorAll('img'));
        const images = imageElements
            .map(img => img.src || img.getAttribute('data-src') || '')
            .filter(src => src && src.startsWith('http') && !src.includes('icon') && !src.includes('logo') && !src.includes('avatar'))
            .filter((src, index, self) => self.indexOf(src) === index) // Unique
            .slice(0, 10); // Limit to 10 images

        // Use Readability to parse the article
        const reader = new Readability(document);
        const article = reader.parse();

        if (!article) {
            console.error(`Readability failed to parse ${url}`);
            return null;
        }

        // Sanitize content
        const contentToSanitize = article.content || "";
        const cleanContent = DOMPurify.sanitize(contentToSanitize);

        return {
            content: cleanContent,
            textContent: article.textContent || "",
            images: images,
            byline: article.byline || undefined,
            siteName: article.siteName || undefined
        };

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}
