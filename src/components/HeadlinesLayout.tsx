"use client";

import { useState } from "react";
import { NewsCard } from "./NewsCard";
import { LayoutGrid, List, Grid3X3, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
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

export function HeadlinesLayout({ initialArticles }: { initialArticles: Article[] }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const sortedArticles = [...initialArticles].sort((a, b) => {
        const dateA = new Date(a.published_at).getTime();
        const dateB = new Date(b.published_at).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const toggleSort = () => {
        setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
    };

    return (
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium">View:</span>
                    <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-8 w-8 p-0 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('compact')}
                            className={`h-8 w-8 p-0 rounded-md ${viewMode === 'compact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-8 w-8 p-0 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSort}
                        className="h-9 border-white/10 bg-black/20 hover:bg-white/5 text-sm font-medium"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                        {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode + sortOrder}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`
                        ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}
                        ${viewMode === 'compact' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : ''}
                        ${viewMode === 'list' ? 'flex flex-col gap-4' : ''}
                    `}
                >
                    {sortedArticles.map((article, index) => (
                        viewMode === 'list' ? (
                            <NewsListItem key={article.id} article={article} index={index} />
                        ) : (
                            <NewsCard key={article.id} article={article} index={index} />
                        )
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function NewsListItem({ article, index }: { article: Article; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={article.image_url || getImageForCategory(article.category || "General")}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col justify-between flex-grow min-w-0">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-primary font-medium">{article.source}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                    </div>
                    <Link href={`/article/${article.id}`} className="block">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {article.title}
                        </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.summary}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
