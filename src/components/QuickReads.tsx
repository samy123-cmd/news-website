"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";

interface Article {
    id: string;
    title: string;
    source: string;
    published_at: string;
    url: string;
}

export function QuickReads({ articles }: { articles: Article[] }) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center space-x-2 mb-6">
                <div className="p-1.5 bg-accent/10 rounded-md">
                    <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-lg">Quick Reads</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {articles.map((article, index) => (
                    <motion.a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group block space-y-2 border-b border-border/40 pb-4 last:border-0 last:pb-0"
                    >
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
                                {article.source}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <h4 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground group-hover:translate-x-1 transition-transform">
                            Read now <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
