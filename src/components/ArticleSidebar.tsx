
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdUnit } from "@/components/AdUnit";
import { analytics } from "@/lib/analytics";

interface RelatedArticle {
    id: string;
    title: string;
    published_at: string;
    source: string;
    image_url?: string;
    category?: string;
    views?: number;
}

interface ArticleSidebarProps {
    currentArticleId: string;
    category: string;
}

export async function ArticleSidebar({ currentArticleId, category }: ArticleSidebarProps) {
    try {
        const supabase = await createClient();

        // Fetch related articles from the same category
        // Fetch related articles from the same category
        let { data: relatedArticles } = await supabase
            .from("articles")
            .select("id, title, published_at, source, image_url, category")
            .eq("category", category)
            .neq("id", currentArticleId)
            .order("published_at", { ascending: false })
            .limit(5);

        // Fallback: If no related articles, fetch trending/recent news
        if (!relatedArticles || relatedArticles.length === 0) {
            const { data: fallbackArticles } = await supabase
                .from("articles")
                .select("id, title, published_at, source, image_url, category, views")
                .neq("id", currentArticleId)
                .order("views", { ascending: false }) // Sort by views for "Trending"
                .order("published_at", { ascending: false }) // Secondary sort by date
                .limit(5);
            relatedArticles = fallbackArticles;
        }

        return (
            <aside className="space-y-8">
                {/* Newsletter CTA */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 ring-1 ring-primary/50">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-white text-sm mb-1">Daily Briefing</h4>
                            <p className="text-xs text-muted-foreground/80 mb-4">The most important AI news, curated for you.</p>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <button className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-primary/20">
                                Subscribe Free
                            </button>
                        </div>
                        <p className="text-[10px] text-white/40 text-center">No spam, unsubscribe anytime.</p>
                    </div>
                </div>

                {/* Related News */}
                <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <h3 className="font-heading font-bold text-lg text-foreground">
                            {relatedArticles && relatedArticles.length > 0 && relatedArticles[0].category === category ? `More in ${category}` : "Trending Now"}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {(relatedArticles as RelatedArticle[] | undefined)?.map((article: RelatedArticle) => (
                            <Link key={article.id} href={`/article/${article.id}`} className="group block">
                                <div className="flex gap-4">
                                    {article.image_url && (
                                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                            {article.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{article.source}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(article.published_at))} ago</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {!relatedArticles?.length && (
                            <p className="text-sm text-muted-foreground">No related articles found.</p>
                        )}
                    </div>

                    <Link
                        href={`/?category=${category}`}
                        className="flex items-center gap-2 text-xs font-bold text-primary mt-6 hover:gap-3 transition-all"
                    >
                        View all {category} news <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Sidebar Ad */}
                <AdUnit slotId="sidebar-sticky" format="rectangle" />
            </aside>
        );
    } catch (error) {
        console.error("Error in ArticleSidebar:", error);
        return null; // Fail gracefully by rendering nothing
    }
}
