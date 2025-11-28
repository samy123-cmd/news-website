
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/NewsCard";
import { Search, Sparkles } from "lucide-react";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl font-heading font-bold mb-4">
                    Search Results for <span className="text-primary">&quot;{query}&quot;</span>
                </h1>
                <p className="text-muted-foreground">
                    Showing results matching your query.
                </p>
            </div>

            <Suspense fallback={<div className="text-center">Loading results...</div>}>
                <SearchResults query={query} />
            </Suspense>
        </div>
    );
}

async function SearchResults({ query }: { query: string }) {
    if (!query) return null;

    const supabase = await createClient();

    // Perform a simple text search on title and summary
    // Note: For production, we should use full text search (fts) but ilike is okay for small scale
    const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error("Search error:", error);
        return <div className="text-red-500">Error searching for articles.</div>;
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">No results found</h2>
                    <p className="text-muted-foreground">
                        We couldn&apos;t find any articles matching &quot;{query}&quot;. Try different keywords.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
            ))}
        </div>
    );
}
