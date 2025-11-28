
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "./NewsCard";
import { Sparkles } from "lucide-react";
import { AdUnit } from "@/components/AdUnit";

interface NewsFeedProps {
    category?: string;
    subcategory?: string;
    limit?: number;
}

export async function NewsFeed({ category, subcategory, limit = 20 }: NewsFeedProps) {
    const supabase = await createClient();

    let query = supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(limit);

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    if (subcategory && subcategory !== "All") {
        query = query.eq("subcategory", subcategory);
    }

    const { data: articles } = await query;

    if (!articles?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-heading font-bold text-foreground">No stories yet</h2>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">
                        Our AI is currently scanning the globe for the latest updates in {category}. Check back in a few minutes.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
                <React.Fragment key={article.id}>
                    <NewsCard article={article} index={index} />
                    {(index + 1) % 6 === 0 && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
                            <AdUnit slotId={`feed-${index}`} label="Sponsored" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
