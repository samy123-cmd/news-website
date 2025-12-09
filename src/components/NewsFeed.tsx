import React from "react";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "./NewsCard";
import { NewsCardFeatured, NewsCardCompact } from "./NewsCardVariants";
import { Sparkles } from "lucide-react";
import { AdUnit } from "@/components/AdUnit";
import { LoadMore } from "@/components/LoadMore";

interface NewsFeedProps {
    category?: string;
    subcategory?: string;
    tag?: string;
    limit?: number;
    initialArticles?: any[];
}

export async function NewsFeed({ category, subcategory, tag, limit = 20, initialArticles }: NewsFeedProps) {
    const supabase = await createClient();

    let rawArticles = initialArticles;

    if (!rawArticles) {
        let query = supabase
            .from("articles")
            .select("*")
            // Prioritize AI-processed articles, then by recency
            .order("ai_processed", { ascending: false, nullsFirst: false })
            .order("published_at", { ascending: false })
            .limit(limit);

        if (category && category !== "All") {
            query = query.eq("category", category);
        }

        if (subcategory && subcategory !== "All") {
            query = query.eq("subcategory", subcategory);
        }

        if (tag) {
            query = query.contains("tags", [tag]);
        }

        const { data, error } = await query;
        if (error) {
            console.error("NewsFeed Query Error:", error);
        }
        rawArticles = data || [];
    }

    // Deduplication Logic
    let articles: typeof rawArticles = [];
    if (rawArticles) {
        const uniqueArticles: typeof rawArticles = [];

        const getSimilarity = (s1: string, s2: string) => {
            const longer = s1.length > s2.length ? s1 : s2;
            const shorter = s1.length > s2.length ? s2 : s1;
            const longerLength = longer.length;
            if (longerLength === 0) return 1.0;

            const costs = new Array();
            for (let i = 0; i <= longer.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= shorter.length; j++) {
                    if (i == 0) costs[j] = j;
                    else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (longer.charAt(i - 1) != shorter.charAt(j - 1))
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0) costs[shorter.length] = lastValue;
            }
            return (longerLength - costs[shorter.length]) / parseFloat(longerLength.toString());
        };

        for (const article of rawArticles) {
            let isDuplicate = false;
            for (const seen of uniqueArticles) {
                if (getSimilarity(article.title.toLowerCase(), seen.title.toLowerCase()) > 0.6) {
                    isDuplicate = true;
                    break;
                }
            }

            if (!isDuplicate) {
                uniqueArticles.push(article);
            }
        }
        articles = uniqueArticles;
    }

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

    // Split articles into sections for Edge-style layout
    const featuredArticles = articles.slice(0, 2);  // First 2 for hero
    const gridArticles = articles.slice(2, 8);      // Next 6 for grid
    const compactArticles = articles.slice(8);       // Rest for compact list

    return (
        <div className="space-y-8">
            {/* Featured Section - Large Hero Tiles */}
            {featuredArticles.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {featuredArticles.map((article) => (
                        <NewsCardFeatured key={article.id} article={article} />
                    ))}
                </div>
            )}

            {/* Standard Grid Section */}
            {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridArticles.map((article, index) => (
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
            )}

            {/* Compact List Section */}
            {compactArticles.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-heading font-bold text-muted-foreground uppercase tracking-wider mb-4">
                        More Stories
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {compactArticles.map((article, index) => (
                            <NewsCardCompact key={article.id} article={article} index={index} />
                        ))}
                    </div>
                </div>
            )}

            <LoadMore initialOffset={articles.length} category={category} subcategory={subcategory} />
        </div>
    );
}

