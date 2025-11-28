
"use client";

import { motion } from "framer-motion";
import { Calendar, Share2, ExternalLink, Clock, Zap, Bookmark, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { analytics } from "@/lib/analytics";

import { getImageForCategory } from "@/lib/constants";

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
    title_hi?: string;
    summary_hi?: string;
}

export function NewsCard({ article, index = 0 }: { article: Article; index?: number }) {
    const { showToast } = useToast();
    const { language, t } = useLanguage();

    const handleBookmark = () => {
        analytics.track('bookmark_click', { articleId: article.id, title: article.title });
        showToast("Article bookmarked for later reading", "success");
    };

    const handleArticleClick = () => {
        analytics.track('article_click', {
            articleId: article.id,
            category: article.category || 'General',
            source: article.source
        });
    };

    const displayTitle = language === 'hi' && article.title_hi ? article.title_hi : article.title;
    const displaySummary = language === 'hi' && article.summary_hi ? article.summary_hi : article.summary;

    return (
        <TooltipProvider>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col h-full overflow-hidden rounded-xl glass-card border border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1"
            >
                {/* Image Section */}
                <Link href={`/article/${article.id}`} onClick={handleArticleClick} className="relative h-52 overflow-hidden block cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-40" />

                    <Image
                        src={article.image_url || getImageForCategory(article.category || "General")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-3 left-3 z-20 flex gap-2">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-md text-foreground rounded-md border border-white/10 shadow-sm">
                            {article.source}
                        </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-20">
                        <div className="flex items-center text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                            <Clock className="w-3 h-3 mr-1.5" />
                            {article.read_time || "3"} {t("min read")}
                        </div>
                    </div>
                </Link>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-5 space-y-4">
                    <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <span className="text-primary uppercase tracking-wider">{article.category || "General"}</span>
                            <span className="text-white/20">•</span>
                            <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`/article/${article.id}`} className="block">
                                    <h3 className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                                        {displayTitle}
                                    </h3>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs p-4 bg-popover text-popover-foreground border-border shadow-xl">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2 text-primary">
                                        <Zap className="w-3 h-3" /> {t("Quick Read")}
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

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                            <Sparkles className="w-3 h-3 text-accent" />
                            AI Curated
                        </div>

                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors" onClick={handleBookmark}>
                                <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
