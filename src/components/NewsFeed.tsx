import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "./NewsCard";

interface NewsFeedProps {
    category?: string;
    subcategory?: string;
}

export async function NewsFeed({ category, subcategory }: NewsFeedProps) {
    const supabase = await createClient();

    let query = supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(20);

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    if (subcategory && subcategory !== "All") {
        query = query.eq("subcategory", subcategory);
    }

    const { data: articles } = await query;

    if (!articles?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl">📰</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-foreground">No news found</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any articles for this category. Try checking back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
            ))}
        </div>
    );
}
