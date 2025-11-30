"use client";

import { Bookmark, Share2, Check } from "lucide-react";
import { useBookmarks } from "@/lib/context/BookmarkContext";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ArticleActionsProps {
    article: {
        id: string;
        title: string;
        summary: string;
        source: string;
        published_at: string;
        image_url?: string;
        category?: string;
        url: string;
    };
}

export function ArticleActions({ article }: ArticleActionsProps) {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    const { showToast } = useToast();
    const [isSharing, setIsSharing] = useState(false);

    const isSaved = isBookmarked(article.id);

    const handleBookmark = () => {
        if (isSaved) {
            removeBookmark(article.id);
        } else {
            addBookmark(article);
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        const shareData = {
            title: article.title,
            text: article.summary,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard", "success");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleBookmark}
                className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isSaved
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "hover:bg-white/5 text-muted-foreground hover:text-primary"
                )}
                title={isSaved ? "Remove from bookmarks" : "Save for later"}
                aria-label={isSaved ? "Remove from bookmarks" : "Save for later"}
            >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
            </button>
            <button
                onClick={handleShare}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-primary"
                title="Share"
                aria-label="Share article"
                disabled={isSharing}
            >
                {isSharing ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <Share2 className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
