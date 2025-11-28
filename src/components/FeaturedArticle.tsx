
"use client";

import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

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
        <div className="relative group w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Full Bleed Image */}
            <Link href={`/article/${article.id}`} className="absolute inset-0 z-10 block cursor-pointer">
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
                {/* Gradient Overlay - Stronger for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] via-[#0b1624]/80 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1624]/90 via-transparent to-transparent opacity-60" />
            </Link>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20 pointer-events-none">
                <div className="space-y-6 max-w-3xl pointer-events-auto">
                    {/* Badge & Meta */}
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-accent-foreground rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured
                        </span>
                        <div className="flex items-center space-x-2 text-xs font-medium text-white/80 uppercase tracking-widest">
                            <span className="text-primary">{article.source}</span>
                            <span>•</span>
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-heading font-bold leading-tight text-white group-hover:text-primary transition-colors drop-shadow-lg">
                        {article.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-gray-300 leading-relaxed text-lg md:text-xl line-clamp-3 md:line-clamp-2 max-w-2xl font-serif">
                        {article.summary}
                    </p>

                    {/* CTA */}
                    <div className="pt-4 flex items-center gap-4">
                        <Button className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/25 h-12 px-6 rounded-xl" asChild>
                            <Link href={`/article/${article.id}`}>
                                Read Full Story
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>

                        <div className="flex items-center text-xs text-white/60 font-medium bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/5">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            3 min read
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
