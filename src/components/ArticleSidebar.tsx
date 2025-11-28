
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdUnit } from "@/components/AdUnit";

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
            {/* AI Key Takeaways (Simulated for now, can be real later) */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-primary/20" />

                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground">AI Key Takeaways</h3>
                </div>

                <ul className="space-y-3">
                    {[
                        "This event marks a significant shift in global policy.",
                        "Experts warn of potential long-term economic impacts.",
                        "New technology could accelerate adoption rates by 50%."
                    ].map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-primary font-bold">•</span>
                            {point}
                        </li>
                    ))}
                </ul>
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
