"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Check, X, Edit2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Article {
    id: string;
    title: string;
    summary: string;
    status: string;
    created_at: string;
    source: string;
    url: string;
}

export function AdminDashboardClient({ initialArticles }: { initialArticles: any[] }) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const supabase = createClient();
    const router = useRouter();

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Optimistic update
        setArticles(articles.map(a => a.id === id ? { ...a, status: newStatus } : a));

        const { error } = await supabase
            .from('articles')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
            router.refresh(); // Revert
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        setArticles(articles.filter(a => a.id !== id));

        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting article:", error);
            alert("Failed to delete article");
            router.refresh();
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h2 className="font-bold">All Articles ({articles.length})</h2>
            </div>

            {articles.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                    No articles found.
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {articles.map((article) => (
                        <div key={article.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-white/5 transition-colors">
                            <div className="flex-grow space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${article.status === 'published'
                                            ? 'bg-green-500/10 text-green-500'
                                            : article.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {article.status || 'published'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleString()}</span>
                                    <span className="text-xs text-muted-foreground">• {article.source}</span>
                                </div>
                                <h3 className="text-lg font-bold">{article.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button variant="ghost" size="icon" title="View" asChild>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        <Eye className="w-4 h-4" />
                                    </a>
                                </Button>

                                <div className="w-px h-6 bg-border mx-1" />

                                {article.status !== 'rejected' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                                        onClick={() => handleStatusUpdate(article.id, 'rejected')}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                )}

                                {article.status !== 'published' && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate(article.id, 'published')}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-red-500"
                                    onClick={() => handleDelete(article.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
