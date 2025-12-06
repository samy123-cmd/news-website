import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
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

