import { FeaturedArticle } from "./FeaturedArticle";
import { QuickReads } from "./QuickReads";

interface QuickReadsArticle {
    id: string;
    title: string;
    source: string;
    published_at: string;
    url: string;
}

interface HeroSectionProps {
    featuredArticle: any; // Type should be imported ideally, but preserving 'any' from previous implicit usage
    quickReadsArticles: QuickReadsArticle[];
}

export function HeroSection({ featuredArticle, quickReadsArticles }: HeroSectionProps) {
    if (!featuredArticle) return null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Hero Content - Desktop: Left 60%, Mobile: Top */}
            <div className="lg:col-span-8 min-h-[500px] relative rounded-2xl overflow-hidden group">
                <FeaturedArticle article={featuredArticle} />
            </div>

            {/* Sidebar / Quick Reads - Desktop: Right 40% */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
                <QuickReads articles={quickReadsArticles || []} />
            </div>
        </section>
    );
}
