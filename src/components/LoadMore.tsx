"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { loadMoreNews } from "@/app/actions/news";
import { NewsCard } from "@/components/NewsCard";
import { AdUnit } from "@/components/AdUnit";

interface LoadMoreProps {
    initialOffset: number;
    category?: string;
    subcategory?: string;
}

export function LoadMore({ initialOffset, category, subcategory }: LoadMoreProps) {
    const [articles, setArticles] = useState<any[]>([]);
    const [offset, setOffset] = useState(initialOffset);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const newArticles = await loadMoreNews(offset, 12, category, subcategory);

            if (newArticles.length === 0) {
                setHasMore(false);
            } else {
                setArticles([...articles, ...newArticles]);
                setOffset(offset + 12);
            }
        } catch (error) {
            console.error("Failed to load more:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {articles.map((article, index) => (
                    <div key={`${article.id}-${index}`} className="contents">
                        <NewsCard article={article} index={index + offset} />
                        {(index + offset + 1) % 6 === 0 && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center my-8">
                                <AdUnit slotId={`feed-more-${index + offset}`} label="Sponsored" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12">
                    <Button
                        onClick={handleLoadMore}
                        disabled={loading}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px] rounded-full border-white/10 hover:bg-white/5 hover:text-primary transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Stories"
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
