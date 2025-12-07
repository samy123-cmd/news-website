"use client";

import * as React from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Article {
    id: string;
    title: string;
    summary: string;
    category: string;
    published_at: string;
    image_url?: string;
    source: string;
}

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = React.useState("");
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [results, setResults] = React.useState<Article[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [fuse, setFuse] = React.useState<Fuse<Article> | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Fetch articles on mount (or when first opened)
    React.useEffect(() => {
        if (isOpen && articles.length === 0) {
            setLoading(true);
            fetch("/api/search")
                .then((res) => res.json())
                .then((data) => {
                    setArticles(data);
                    const fuseInstance = new Fuse<Article>(data, {
                        keys: ["title", "summary", "category", "source"],
                        threshold: 0.3,
                    });
                    setFuse(fuseInstance);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load search index", err);
                    setLoading(false);
                });
        }
    }, [isOpen, articles.length]);

    // Focus input when opened
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle search
    React.useEffect(() => {
        if (!fuse || !query) {
            setResults([]);
            return;
        }
        const searchResults = fuse.search(query).map((result) => result.item);
        setResults(searchResults.slice(0, 5)); // Limit to 5 results
    }, [query, fuse]);

    // Close on Escape
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleSelect = (id: string) => {
        router.push(`/article/${id}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#0b1624] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center p-4 border-b border-white/10 gap-3">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search news, topics, or sources..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-muted-foreground/50"
                            />
                            {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                            <button
                                onClick={onClose}
                                aria-label="Close search"
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((article) => (
                                        <div
                                            key={article.id}
                                            onClick={() => handleSelect(article.id)}
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                                {article.image_url && (
                                                    <Image
                                                        src={article.image_url}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                                                    {article.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                    <span className="text-primary">{article.category}</span>
                                                    <span>•</span>
                                                    <span>{article.source}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors self-center" />
                                        </div>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    Type to search across global news sources...
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-white/5 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                            <span>Search by Fuse.js</span>
                            <div className="flex gap-2">
                                <span className="px-1.5 py-0.5 rounded border border-white/10 bg-black/20">Esc</span> to close
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
