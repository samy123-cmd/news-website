import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: Request) {
    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, 'search', RATE_LIMITS.SEARCH);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            {
                status: 429,
                headers: rateLimitHeaders(rateLimitResult)
            }
        );
    }

    try {
        const supabase = await createClient();

        const { data: articles, error } = await supabase
            .from("articles")
            .select("id, title, summary, category, published_at, image_url, source")
            .order("published_at", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Search API error:", error);
            return NextResponse.json([], { status: 200 }); // Return empty array on error
        }

        return NextResponse.json(articles || []);
    } catch (error) {
        console.error("Search API unexpected error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

