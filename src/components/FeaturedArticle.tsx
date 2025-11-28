"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Article {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    image_url?: string;
    url: string;
    category?: string;
}

export function FeaturedArticle({ article }: { article: Article }) {
    return (
        <div className="relative group grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 h-full min-h-[500px] overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
            {/* Image Section */}
            <div className="lg:col-span-8 relative h-64 lg:h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 lg:hidden" />
                {article.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-muted" />
                )}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-lg">
                        Featured
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col justify-center relative z-20 bg-card">
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        <span className="text-primary">{article.source}</span>
                        <span>•</span>
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-heading font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {article.title}
                    </h2>

                    <p className="text-muted-foreground leading-relaxed text-lg line-clamp-4">
                        {article.summary}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            3 min read
                        </div>

                        <Button className="group/btn" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read Full Story
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
