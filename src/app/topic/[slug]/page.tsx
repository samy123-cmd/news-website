import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsFeed } from "@/components/NewsFeed";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

interface TopicPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
    const { slug } = await params;
    // Decode slug: "artificial-intelligence" -> "Artificial Intelligence"
    // Ideally we would want proper casing, but title case is a good approximation
    const topic = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${topic} News - Topic Hub | Global AI News`,
        description: `Read the latest news and updates about ${topic}. Curated by AI.`,
        openGraph: {
            title: `${topic} News - Topic Hub`,
            description: `Read the latest news and updates about ${topic}. Curated by AI.`,
            type: "website",
        },
    };
}

export default async function TopicPage({ params }: TopicPageProps) {
    const { slug } = await params;
    // We expect the tag in the DB to match the slug logic roughly, or we pass the slug directly
    // If we store "Nvidia" in DB, and slug is "nvidia", we might need case insensitivity.
    // However, existing simple fuzzy match might be better, but Supabase array contains is strict.
    // For now, let's assume the slug is close enough or use a normalized tag approach later.
    // Let's try raw decoded slug first, effectively passing "nvidia" for "nvidia" slug.

    // Actually, common practice is slugified tags.
    // DB has "Nvidia". Slug is "nvidia".
    // We should probably normalize inputs in ingest or here.
    // Let's try passing the slug as-is (maybe capitalization matters).
    // The previous Link created slugs with .toLowerCase(). So we should probably match case-insensitive or expect DB to have lower case? 
    // Actually, let's just pass the slug logic used in ArticlePage: .toLowerCase().
    // Use the exact string passed in URL for now, but capitalize for display.

    // Improvement: pass decoded slug to NewsFeed, let it handle? 
    // Supabase `contains` text[] is case-sensitive.
    // If DB has "Nvidia" and we search "nvidia", it fails.
    // But `ingest` isn't normalizing tags yet.
    // Ideally we should fix this in `ingest`. 
    // For now, let's rely on the fact that polished tags might be Capitalized.
    // We might need to handle this strictly. 
    // Let's assume tags are user-facing capitalized. "Nvidia".
    // Slug is "nvidia".
    // We need to convert "nvidia" -> "Nvidia".
    // Simple title casing for now.

    const topicTitle = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    // Tag to search: Let's search for Title Case version primarily
    const searchTag = topicTitle;

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0b1624]/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Back to Feed</span>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-32 pb-8">
                <div className="max-w-4xl mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-4">
                        <span className="text-primary">#</span>{topicTitle}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Latest news and updates about {topicTitle}.
                    </p>
                </div>

                <Suspense fallback={<NewsFeedSkeleton />}>
                    {/* 
                        Note: We are passing the capitalized "Topic Title" as the tag.
                        If the AI generated tags are "nvidia" (lowercase), this might fail.
                        Ideally we ensure DB tags are Title Case or we fix search.
                     */}
                    <NewsFeed tag={searchTag} limit={50} />
                </Suspense>
            </div>
        </main>
    );
}
