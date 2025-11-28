
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

interface Article {
    id: string;
    title: string;
    source: string;
    published_at: string;
    url: string;
}

export function QuickReads({ articles }: { articles: Article[] }) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center space-x-2 mb-6 px-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                    <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Quick Reads</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {articles.map((article, index) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={`/article/${article.id}`}
                            className="group block p-4 rounded-xl bg-[#142235] border border-white/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                                    {article.source}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <h4 className="font-medium text-sm leading-snug text-foreground/90 group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                {article.title}
                            </h4>
                            <div className="flex items-center text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                Read now <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
