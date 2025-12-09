"use client";

import { motion } from "framer-motion";
import { Clock, Zap, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useBookmarks } from "@/lib/context/BookmarkContext";
import { formatDistanceToNow } from "date-fns";
import { analytics } from "@/lib/analytics";
import { getImageForCategory } from "@/lib/constants";
import { stripHtml } from "@/lib/utils/text";

interface Article {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    image_url?: string;
    url: string;
    category?: string;
    read_time?: string;
}

/**
 * Featured NewsCard - Large tile for hero stories (Edge-style)
 * Used for the first 1-2 articles in the feed
 */
export function NewsCardFeatured({ article }: { article: Article }) {
    const { showToast } = useToast();
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
    const [timeStatus, setTimeStatus] = useState<'breaking' | 'new' | 'old' | null>(null);

    useEffect(() => {
        const published = new Date(article.published_at);
        const now = new Date();
        const diffInHours = (now.getTime() - published.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) setTimeStatus('breaking');
        else if (diffInHours < 24) setTimeStatus('new');
        else setTimeStatus('old');
    }, [article.published_at]);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isBookmarked(article.id)) {
            removeBookmark(article.id);
        } else {
            addBookmark({ ...article });
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/article/${article.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: article.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                showToast("Link copied!", "success");
            }
        } catch (err) { }
    };

    return (
        <Link
            href={`/article/${article.id}`}
            className="group block relative overflow-hidden rounded-2xl bg-black h-full min-h-[400px] lg:min-h-[500px] cursor-pointer"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
            >
                {/* Background Image */}
                <Image
                    src={article.image_url || getImageForCategory(article.category || "General")}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEEAQUBAAAAAAAAAAAAAQIDAAQREiEFBhMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAMBAQEAAAAAAAAAAAAAAAABAhEhMf/aAAwDAQACEQMRAD8AqbrvxXWy9x3MnQ/9SlKhdO//2Q=="
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </motion.div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-full">
                    {article.category || "General"}
                </span>
                {timeStatus === 'breaking' && (
                    <span className="px-3 py-1.5 text-xs font-bold uppercase bg-red-600 text-white rounded-full flex items-center gap-1 animate-pulse">
                        <Zap className="w-3 h-3 fill-current" /> Breaking
                    </span>
                )}
                {timeStatus === 'new' && (
                    <span className="px-3 py-1.5 text-xs font-bold uppercase bg-green-600 text-white rounded-full">
                        New
                    </span>
                )}
            </div>

            {/* Action Buttons - These need to be interactive */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 ${isBookmarked(article.id) ? "text-primary" : "text-white"} hover:bg-white/20`}
                    onClick={handleBookmark}
                >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(article.id) ? "fill-current" : ""}`} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20"
                    onClick={handleShare}
                >
                    <Share2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Content - pointer-events-none so clicks pass through to Link */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10 pointer-events-none">
                <div className="flex items-center gap-3 text-sm text-white/80 mb-3">
                    <span className="font-medium">{article.source}</span>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.read_time || "3"} min read
                    </span>
                    <span className="text-white/40">•</span>
                    <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                </div>

                <h2 className="text-2xl lg:text-4xl font-heading font-bold text-white leading-tight mb-4 drop-shadow-md line-clamp-3">
                    {article.title}
                </h2>

                <p className="text-white/70 text-base lg:text-lg leading-relaxed line-clamp-2 max-w-3xl">
                    {stripHtml(article.summary || "")}
                </p>
            </div>
        </Link>
    );
}

/**
 * Compact NewsCard - Horizontal list-style (Edge-style)
 * Used for articles beyond the main grid
 */
export function NewsCardCompact({ article, index = 0 }: { article: Article; index?: number }) {
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
    const [timeStatus, setTimeStatus] = useState<'breaking' | 'new' | 'old' | null>(null);

    useEffect(() => {
        const published = new Date(article.published_at);
        const now = new Date();
        const diffInHours = (now.getTime() - published.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) setTimeStatus('breaking');
        else if (diffInHours < 24) setTimeStatus('new');
        else setTimeStatus('old');
    }, [article.published_at]);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isBookmarked(article.id)) {
            removeBookmark(article.id);
        } else {
            addBookmark({ ...article });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
        >
            <Link
                href={`/article/${article.id}`}
                className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
            >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={article.image_url || getImageForCategory(article.category || "General")}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEEAQUBAAAAAAAAAAAAAQIDAAQREiEFBhMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAMBAQEAAAAAAAAAAAAAAAABAhEhMf/aAAwDAQACEQMRAD8AqbrvxXWy9x3MnQ/9SlKhdO//2Q=="
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                        <span className="text-primary font-bold uppercase tracking-wide">{article.category}</span>
                        <span className="text-white/20">•</span>
                        <span>{article.source}</span>
                        {timeStatus === 'breaking' && (
                            <>
                                <span className="text-white/20">•</span>
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-current" /> Breaking
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="font-heading font-bold text-white text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.read_time || "3"} min
                        </span>
                        <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Bookmark Button */}
                <button
                    onClick={handleBookmark}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${isBookmarked(article.id) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(article.id) ? "fill-current" : ""}`} />
                </button>
            </Link>
        </motion.div>
    );
}
