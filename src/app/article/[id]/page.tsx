import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Share2, Bookmark, Clock, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { cn } from '@/lib/utils';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface ArticlePageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: article } = await supabase
        .from('articles')
        .select('title, summary, image_url, category, published_at')
        .eq('id', id)
        .single();

    if (!article) {
        return {
            title: 'Article Not Found | Global AI News',
            description: 'The requested article could not be found.',
        };
    }

    return {
        title: `${article.title} | Global AI News`,
        description: article.summary || `Read the latest news about ${article.category} on Global AI News.`,
        openGraph: {
            title: article.title,
            description: article.summary || `Read the latest news about ${article.category} on Global AI News.`,
            url: `https://global-ai-news.com/article/${id}`,
            siteName: 'Global AI News',
            images: article.image_url ? [{ url: article.image_url }] : [],
            type: 'article',
            publishedTime: article.published_at,
            section: article.category,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.summary || `Read the latest news about ${article.category} on Global AI News.`,
            images: article.image_url ? [article.image_url] : [],
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !article) {
        notFound();
    }

    // Sanitize content just in case (though we do it at ingestion)
    const cleanContent = DOMPurify.sanitize(article.content || article.summary);

    // Generate a deterministic gradient based on the category
    const getCategoryGradient = (category: string) => {
        const gradients: Record<string, string> = {
            World: "from-blue-900 via-slate-900 to-black",
            Business: "from-emerald-900 via-slate-900 to-black",
            Technology: "from-indigo-900 via-slate-900 to-black",
            Entertainment: "from-purple-900 via-slate-900 to-black",
            Sports: "from-orange-900 via-slate-900 to-black",
            Science: "from-cyan-900 via-slate-900 to-black",
            Health: "from-rose-900 via-slate-900 to-black",
        };
        return gradients[category] || "from-slate-900 via-gray-900 to-black";
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <ArticleJsonLd article={article} />
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b1624]/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Back to Feed</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-primary" title="Save for later">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-primary" title="Share">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section (Full Width) */}
            <div className={cn(
                "relative w-full min-h-[60vh] flex items-end pb-16 pt-32",
                !article.image_url && `bg-gradient-to-b ${getCategoryGradient(article.category || 'General')}`
            )}>
                {article.image_url && (
                    <>
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] via-[#0b1624]/60 to-transparent" />
                    </>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(30,167,255,0.4)]">
                                {article.category}
                            </span>
                            {article.subcategory && (
                                <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                                    {article.subcategory}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white mb-8 drop-shadow-lg">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-gray-300 border-t border-white/10 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
                                    {article.source?.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{article.source}</p>
                                    <p className="text-xs text-gray-400">Verified Source</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                            </div>
                            {article.url && (
                                <>
                                    <div className="h-8 w-px bg-white/10" />
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-primary transition-colors font-medium"
                                    >
                                        <span>Read Original</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        {/* Article Body */}
                        <article className="prose prose-lg dark:prose-invert max-w-none">
                            <div
                                className="font-serif text-xl leading-relaxed text-gray-300 
                                first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left
                                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-white prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />
                        </article>

                        {/* AI Provenance & Source */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Provenance</span>
                                </div>
                                <p className="text-sm text-gray-400 italic mb-4">
                                    This article was summarized and polished by our AI engine to ensure clarity and neutrality.
                                    <br />
                                    <span className="text-white/80 not-italic">Reviewed by: <span className="font-bold text-white">Global AI News Team</span></span>
                                </p>
                                {article.url && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Source:</span>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1 font-medium"
                                        >
                                            {article.source}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Gallery */}
                        {article.images && article.images.length > 1 && (
                            <div className="mt-16 pt-16 border-t border-white/10">
                                <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full" />
                                    In Pictures
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {article.images.slice(1).map((img: string, idx: number) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                                            <Image
                                                src={img}
                                                alt={`Gallery image ${idx + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments / Engagement Placeholder */}
                        <div className="mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
                            <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Join the Conversation</h3>
                            <p className="text-muted-foreground mb-6">Sign in to share your thoughts on this story.</p>
                            <Link href="/login" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24">
                            <ArticleSidebar currentArticleId={id} category={article.category || 'General'} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
