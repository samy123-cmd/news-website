"use client";

import { Bookmark, Share2, Check } from "lucide-react";
import { useBookmarks } from "@/lib/context/BookmarkContext";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";
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

    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

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
            url: currentUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(currentUrl);
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

            <div className="h-4 w-px bg-border/50 mx-1" />

            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}&via=GlobalAINews`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] rounded-full transition-colors text-muted-foreground"
                title="Share on X (Twitter)"
                aria-label="Share on X"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>

            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] rounded-full transition-colors text-muted-foreground"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>
            </a>

            <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[#25D366]/10 hover:text-[#25D366] rounded-full transition-colors text-muted-foreground"
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
            </a>

            <button
                onClick={handleShare}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white"
                title="Copy Link"
                aria-label="Copy Link"
                disabled={isSharing}
            >
                {isSharing ? (
                    <Check className="w-5 h-5 text-green-500" />
                ) : (
                    <Share2 className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
