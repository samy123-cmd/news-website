"use server";

import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import sanitizeHtml from 'sanitize-html';

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
        const { document } = parseHTML(html);

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
        const cleanContent = sanitizeHtml(contentToSanitize, {
            allowedTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'hr',
                'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark',
                'a', 'img',
                'ul', 'ol', 'li',
                'blockquote', 'pre', 'code',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'div', 'span',
                'sub', 'sup'
            ],
            allowedAttributes: {
                'a': ['href', 'target', 'rel'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
                '*': ['class', 'id']
            },
            allowedSchemes: ['http', 'https', 'mailto'],
            allowedSchemesByTag: {
                'img': ['http', 'https', 'data']
            }
        });

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
