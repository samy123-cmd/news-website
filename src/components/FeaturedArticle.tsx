
"use client";

import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
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
}

import { analytics } from "@/lib/analytics";

export function FeaturedArticle({ article }: { article: Article }) {
    const handleArticleClick = () => {
        analytics.track('hero_click', {
            articleId: article.id,
            title: article.title
        });
    };

    return (
        <div className="relative group w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Full Bleed Image */}
            <Link href={`/article/${article.id}`} onClick={handleArticleClick} className="absolute inset-0 z-10 block cursor-pointer">
                {article.image_url ? (
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                {/* Gradient Overlay - Optimized for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent opacity-60" />
            </Link>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20 pointer-events-none">
                <div className="space-y-6 max-w-4xl pointer-events-auto">
                    {/* Badge & Meta */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured Story
                        </span>
                        <div className="flex items-center space-x-3 text-sm font-medium text-white/90 uppercase tracking-widest">
                            <span className="text-accent">{article.source}</span>
                            <span className="text-white/40">•</span>
                            <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] text-white group-hover:text-primary transition-colors drop-shadow-lg tracking-tight">
                        {article.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-slate-300 leading-relaxed text-lg md:text-xl line-clamp-3 md:line-clamp-2 max-w-3xl font-serif">
                        {stripHtml(article.summary)}
                    </p>

                    {/* CTA */}
                    <div className="pt-6 flex items-center gap-4">
                        <Link
                            href={`/article/${article.id}`}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-12 px-8 rounded-full"
                        >
                            Read Full Story
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <div className="flex items-center text-xs text-white/70 font-medium bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
                            <Clock className="w-3.5 h-3.5 mr-2" />
                            3 min read
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
