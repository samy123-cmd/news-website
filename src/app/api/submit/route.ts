import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z, ZodError } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';

// Validation schema for article submissions
const submitSchema = z.object({
    title: z.string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must be less than 200 characters"),
    content: z.string()
        .min(50, "Content must be at least 50 characters")
        .max(50000, "Content must be less than 50,000 characters"),
    category: z.string()
        .min(2, "Category is required"),
    author_name: z.string()
        .min(2, "Author name must be at least 2 characters")
        .max(100, "Author name must be less than 100 characters"),
    author_email: z.string()
        .email("Please enter a valid email address"),
});

export async function POST(request: Request) {
    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, 'submit', RATE_LIMITS.SUBMIT);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: rateLimitHeaders(rateLimitResult)
            }
        );
    }

    try {
        const body = await request.json();

        // Validate input with Zod
        const validated = submitSchema.parse(body);

        // Sanitize content to prevent XSS
        const sanitizedTitle = sanitizeHtml(validated.title, {
            allowedTags: [],
            allowedAttributes: {},
        });
        const sanitizedContent = sanitizeHtml(validated.content, {
            allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
            allowedAttributes: {},
        });
        const sanitizedAuthorName = sanitizeHtml(validated.author_name, {
            allowedTags: [],
            allowedAttributes: {},
        });

        const supabase = await createClient();

        // Generate a URL slug from title
        const slug = sanitizedTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const uniqueUrl = `https://global-ai-news.com/article/${slug}-${Date.now()}`;

        const { error } = await supabase
            .from('articles')
            .insert({
                title: sanitizedTitle,
                content: sanitizedContent,
                summary: sanitizedContent.substring(0, 200) + '...',
                category: validated.category,
                author_name: sanitizedAuthorName,
                author_email: validated.author_email,
                status: 'pending', // Pending review
                url: uniqueUrl,
                published_at: new Date().toISOString(),
                source: 'Community Submission'
            } as any);

        if (error) {
            console.error("Submission Error:", error);
            return NextResponse.json({ error: "Failed to submit article" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Article submitted for review" });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }
        console.error("Submit API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

