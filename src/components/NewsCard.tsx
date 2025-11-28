"use client";

import { motion } from "framer-motion";
import { Calendar, Share2, ExternalLink, Clock, Zap, Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/context/LanguageContext";
import { formatDistanceToNow } from "date-fns";

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

export function NewsCard({ article, index = 0 }: { article: Article; index?: number }) {
    const { showToast } = useToast();
    const { language, t } = useLanguage();

    const handleBookmark = () => {
        showToast("Article bookmarked for later reading", "success");
    };

    // Use Hindi content if available and language is 'hi', otherwise fallback to English
    const displayTitle = language === 'hi' && (article as any).title_hi ? (article as any).title_hi : article.title;
    const displaySummary = language === 'hi' && (article as any).summary_hi ? (article as any).summary_hi : article.summary;

    return (
        <TooltipProvider>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col h-full overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
                <div className="relative h-48 bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80"}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-background/80 backdrop-blur-md text-foreground rounded-full border border-border/50 shadow-sm">
                            {article.source}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        {article.read_time || "3"} {t("min read")}
                    </div>
                </div>

                <div className="flex flex-col flex-grow p-5 space-y-4">
                    <div className="space-y-2 flex-grow">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {displayTitle}
                                </h3>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs p-4 bg-popover text-popover-foreground border-border">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-yellow-500" /> {t("Quick Read")}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {displaySummary}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>

                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed font-serif">
                            {displaySummary || "No summary available."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleBookmark}>
                                <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 px-3 text-xs gap-1.5" asChild>
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    {t("Read More")} <ArrowRight className="w-3 h-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
