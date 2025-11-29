import { createClient } from "@/lib/supabase/server";
import { FeaturedArticle } from "./FeaturedArticle";
import { QuickReads } from "./QuickReads";

export async function HeroSection() {
    const supabase = await createClient();

    // Fetch featured and quick reads in parallel
    const [featuredResult, quickReadsResult] = await Promise.all([
        supabase
            .from("articles")
            .select("*")
            .not("image_url", "is", null)
            .order("published_at", { ascending: false })
            .limit(1)
            .single(),
        supabase
            .from("articles")
            .select("id, title, source, published_at, url")
            .order("published_at", { ascending: false })
            .limit(6) // Fetch 6 to ensure we have enough even if we filter out the featured one
    ]);

    const featuredData = featuredResult.data;
    let quickReadsData = quickReadsResult.data || [];

    // Filter out the featured article from quick reads
    if (featuredData) {
        quickReadsData = quickReadsData.filter(a => a.id !== featuredData.id).slice(0, 5);
    }

    if (!featuredData) return null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Hero Content - Desktop: Left 60%, Mobile: Top */}
            <div className="lg:col-span-8 min-h-[500px] relative rounded-2xl overflow-hidden group">
                <FeaturedArticle article={featuredData} />
            </div>

            {/* Sidebar / Quick Reads - Desktop: Right 40% */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
                <QuickReads articles={quickReadsData || []} />
            </div>
        </section>
    );
}
