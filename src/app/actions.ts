'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { fetchNewsByCategory } from '@/lib/ingest';
import { scrapeTrends } from '@/lib/trends';

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: "You are already subscribed!" };
        }
        console.error("Newsletter error:", error);
        return { error: "Something went wrong. Please try again." };
    }

    revalidatePath('/');
    return { success: "Thank you for subscribing!" };
}

export async function getLatestNews(category: string, limit: number = 20) {
    const supabase = await createClient();

    // 1. Try to fetch fresh news from DB (e.g., last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    let query = supabase
        .from('articles')
        .select('*')
        .gt('published_at', thirtyMinutesAgo)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (category !== 'All') {
        // Normalize category to Title Case (e.g., "sports" -> "Sports")
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        query = query.eq('category', formattedCategory);
    }

    const { data: cachedNews, error } = await query;

    // If we have enough fresh news, return it
    if (cachedNews && cachedNews.length >= 5) {
        return cachedNews;
    }

    // 2. If not enough fresh news, fetch from RSS (which also upserts to DB)
    const news = await fetchNewsByCategory(category);

    return news;
}

export async function getTwitterTrends(scope: 'global' | 'local') {
    return await scrapeTrends(scope);
}
