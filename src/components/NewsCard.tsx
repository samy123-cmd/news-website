
"use client";

import { motion } from "framer-motion";
import { Calendar, Share2, ExternalLink, Clock, Zap, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
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
        showToast("Article bookmarked for later reading", "success");
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
                className="group flex flex-col h-full overflow-hidden rounded-2xl glass-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
            >
                {/* Image Section */}
                <Link href={`/article/${article.id}`} className="relative h-56 overflow-hidden block cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] to-transparent z-10 opacity-60" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.image_url || getImageForCategory(article.category || "General")}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10 shadow-lg">
                            {article.source}
                        </span>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                        <div className="flex items-center text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                            <Clock className="w-3 h-3 mr-1.5" />
                            {article.read_time || "3"} {t("min read")}
                        </div>
                    </div>
                </Link>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6 space-y-4">
                    <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{article.category || "General"}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`/article/${article.id}`} className="block">
                                    <h3 className="font-heading text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-3">
                                        {displayTitle}
                                    </h3>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs p-4 bg-[#142235] text-white border-white/10 shadow-xl">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2 text-primary">
                                        <Zap className="w-3 h-3" /> {t("Quick Read")}
                                    </h4>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        {displaySummary}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>

                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed font-sans">
                            {displaySummary || "No summary available."}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors" onClick={handleBookmark}>
                                <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button size="sm" className="h-9 px-4 text-xs font-bold bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all rounded-lg group/btn" asChild>
                            <Link href={`/article/${article.id}`}>
                                {t("Read More")}
                                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
