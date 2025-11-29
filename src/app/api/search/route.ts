import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    const supabase = await createClient();

    const { data: articles } = await supabase
        .from("articles")
        .select("id, title, summary, category, published_at, image_url, source")
        .order("published_at", { ascending: false })
        .limit(100);

    return NextResponse.json(articles || []);
}
