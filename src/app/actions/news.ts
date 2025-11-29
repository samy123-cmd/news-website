"use server";

import { createClient } from "@/lib/supabase/server";

export async function loadMoreNews(offset: number, limit: number, category: string = "All", subcategory: string = "All") {
    const supabase = await createClient();

    let query = supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    if (subcategory && subcategory !== "All") {
        query = query.eq("subcategory", subcategory);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error loading more news:", error);
        return [];
    }

    return data || [];
}
