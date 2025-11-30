"use client";

import { TextPageLayout } from "@/components/TextPageLayout";
import { useBookmarks } from "@/lib/context/BookmarkContext";
import { NewsCard } from "@/components/NewsCard";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function BookmarksPage() {
    const { bookmarks } = useBookmarks();

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-heading font-bold text-foreground">Your Bookmarks</h1>
                        <p className="text-muted-foreground text-lg">
                            {bookmarks.length} {bookmarks.length === 1 ? "article" : "articles"} saved for later reading
                        </p>
                    </div>
                </div>

                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookmarks.map((article, index) => (
                            <NewsCard key={article.id} article={article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bookmark className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-heading font-bold text-foreground">No bookmarks yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto text-lg">
                                Save interesting stories by clicking the bookmark icon on any article card.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/">Explore News</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
