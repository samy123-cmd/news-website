"use client";

import { Bookmark, Share2, Check, Link as LinkIcon, Twitter, Linkedin, Facebook } from "lucide-react";
import { useBookmarks } from "@/lib/context/BookmarkContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
    const [copied, setCopied] = useState(false);
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

    const handleShare = (platform: "twitter" | "linkedin" | "facebook") => {
        if (!currentUrl) return;

        let shareUrl = "";
        const text = `Just read this interesting piece on Global AI News: "${article.title}"`;

        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                break;
        }

        window.open(shareUrl, "_blank", "width=600,height=400");
    };

    const handleCopy = async () => {
        if (!currentUrl) return;
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className="flex items-center gap-1 md:gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={cn(
                    "rounded-full transition-all duration-300",
                    isSaved
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "hover:bg-white/5 text-muted-foreground hover:text-primary"
                )}
                title={isSaved ? "Remove from bookmarks" : "Save for later"}
                aria-label={isSaved ? "Remove from bookmarks" : "Save for later"}
            >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
            </Button>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Social Share Buttons */}
            <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-muted-foreground transition-all"
                onClick={() => handleShare("twitter")}
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 text-muted-foreground transition-all"
                onClick={() => handleShare("linkedin")}
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:text-[#1877F2] hover:bg-[#1877F2]/10 text-muted-foreground transition-all"
                onClick={() => handleShare("facebook")}
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                className={cn(
                    "rounded-full transition-all text-muted-foreground",
                    copied ? "text-green-500 bg-green-500/10" : "hover:text-primary hover:bg-primary/10"
                )}
                onClick={handleCopy}
                aria-label="Copy Link"
            >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </Button>
        </div>
    );
}


