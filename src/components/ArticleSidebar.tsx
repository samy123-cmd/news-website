
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdUnit } from "@/components/AdUnit";
import { analytics } from "@/lib/analytics";

interface ArticleSidebarProps {
    currentArticleId: string;
    category: string;
}

export async function ArticleSidebar({ currentArticleId, category }: ArticleSidebarProps) {
    const supabase = await createClient();

    // Fetch related articles from the same category
    const { data: relatedArticles } = await supabase
        .from("articles")
        .select("id, title, published_at, source, image_url")
        .eq("category", category)
        .neq("id", currentArticleId)
        .order("published_at", { ascending: false })
        .limit(5);

    return (
        <aside className="space-y-8">
            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

                <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 ring-1 ring-primary/50">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>

                    <p className="text-[10px] text-white/40">No spam, unsubscribe anytime.</p>
                </div>
            </div>

            {/* Related News */}
            <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h3 className="font-heading font-bold text-lg text-foreground">More in {category}</h3>
                </div>

                <div className="space-y-6">
                    {relatedArticles?.map((article) => (
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
}
