import { createClient } from '@/lib/supabase/server';
import sanitizeHtml from 'sanitize-html';
import { Sparkles, ExternalLink, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/Button";
import { polishArticleAction } from '@/app/actions/polish';
import { linkKeywords } from '@/lib/utils/linker';
import { JoinConversation } from './JoinConversation';

const isDev = process.env.NODE_ENV === 'development';

interface ArticleContentProps {
    article: any;
}

export async function ArticleContent({ article }: ArticleContentProps) {
    try {
        const supabase = await createClient();

        // Check if content is too short and needs polishing
        const contentLength = (article.content?.length || 0);
        const summaryLength = (article.summary?.length || 0);
        const totalContentLength = Math.max(contentLength, summaryLength);

        // If content is too short (less than 500 chars), try to expand it
        if (totalContentLength < 500 && article.url && article.title) {
            if (isDev) console.log(`[ArticleContent] Content too short (${totalContentLength} chars), triggering AI polish for ${article.id}`);

            try {
                const polishResult = await polishArticleAction(article.id, article.url, article.title);

                if (polishResult.success) {
                    // Re-fetch the article with expanded content
                    const { data: refreshedArticle } = await supabase
                        .from('articles')
                        .select('content, summary')
                        .eq('id', article.id)
                        .single();

                    if (refreshedArticle) {
                        article.content = refreshedArticle.content;
                        article.summary = refreshedArticle.summary;
                        if (isDev) console.log(`[ArticleContent] Successfully expanded content to ${refreshedArticle.content?.length || 0} chars`);
                    }
                }
            } catch (polishError) {
                console.error('[ArticleContent] Polish failed:', polishError);
                // Continue with original short content
            }
        }

        // Format content: Convert newlines to paragraphs if it looks like plain text
        let formattedContent = article.content || article.summary || "";

        // If content doesn't have HTML tags, wrap paragraphs
        if (!formattedContent.includes('<p>') && !formattedContent.includes('<br>')) {
            formattedContent = formattedContent
                .split(/\n\s*\n/)
                .filter((p: string) => p.trim().length > 0)
                .map((p: string) => `<p>${p.trim()}</p>`)
                .join('');
        }

        // Apply Contextual Linking (New Feature)
        // We do this before sanitization, but ensuring our linker produces valid HTML that passes sanitization.
        formattedContent = linkKeywords(formattedContent);

        const cleanContent = sanitizeHtml(formattedContent, {
            allowedTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'hr',
                'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark',
                'a', 'img',
                'ul', 'ol', 'li',
                'blockquote', 'pre', 'code',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'div', 'span',
                'sub', 'sup'
            ],
            allowedAttributes: {
                'a': ['href', 'target', 'rel'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
                '*': ['class', 'id']
            },
            allowedSchemes: ['http', 'https', 'mailto'],
            allowedSchemesByTag: {
                'img': ['http', 'https', 'data']
            }
        });

        return (
            <div className="lg:col-span-8">
                {/* Article Body */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <div
                        className="font-serif text-lg md:text-xl leading-8 md:leading-loose text-gray-300 tracking-wide
                        first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]
                        [&_p]:mb-8 [&_p]:leading-loose
                        [&_h2]:text-2xl [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-6
                        [&_h3]:text-xl [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4
                        [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline
                        [&_strong]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-white/5 [&_blockquote]:py-6 [&_blockquote]:px-8 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:my-8
                        [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:w-full
                        [&_mark]:bg-transparent [&_mark]:text-inherit
                        [&_span]:bg-transparent! [&_span]:text-inherit
                        [&_*]:bg-transparent"
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />
                </article>

                {/* AI Provenance & Source */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">AI-Enhanced Reporting</h3>
                                    <p className="text-xs text-muted-foreground">Transparency & Provenance</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Verified by Editorial Board</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
                            <div className="space-y-2">
                                <p className="font-bold text-white text-xs uppercase tracking-wider">Methodology</p>
                                <p className="leading-relaxed">
                                    This article was synthesized from multiple verified sources to provide a neutral, comprehensive overview. Our AI engine cross-references facts to minimize bias.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold text-white text-xs uppercase tracking-wider">Primary Source</p>
                                {article.url ? (
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary hover:underline bg-primary/5 p-3 rounded-lg border border-primary/10 transition-colors hover:bg-primary/10"
                                    >
                                        <span className="font-bold">{article.source}</span>
                                        <ExternalLink className="w-3 h-3 ml-auto" />
                                    </a>
                                ) : (
                                    <p>Source unavailable</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline Ad Placeholder (Monetization) */}
                <div className="my-12 flex justify-center">
                    <div className="w-full max-w-[728px] h-[90px] bg-[#0b1624] border border-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        {/* CSS Pattern Background */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] z-10">Advertisement Space</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
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
                <JoinConversation />
            </div>
        );
    } catch (error) {
        console.error("Error in ArticleContent:", error);
        // Fallback UI - still sanitize content to prevent XSS
        const fallbackContent = sanitizeHtml(article.content || article.summary || "", {
            allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
            allowedAttributes: {},
        });
        return (
            <div className="lg:col-span-8">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
                </article>
                <p className="text-sm text-muted-foreground mt-4 italic">
                    Note: Some AI-enhanced features may be temporarily unavailable.
                </p>
            </div>
        );
    }
}
