import { createClient } from "@/lib/supabase/server";
import { FeaturedArticle } from "./FeaturedArticle";
import { QuickReads } from "./QuickReads";

export async function HeroSection() {
    const supabase = await createClient();

    // Fetch featured article (latest one with an image)
    const { data: featuredData } = await supabase
        .from("articles")
        .select("*")
        .not("image_url", "is", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

    // Fetch quick reads (latest 5 articles, excluding the featured one if possible)
    const { data: quickReadsData } = await supabase
        .from("articles")
        .select("id, title, source, published_at, url")
        .neq("id", featuredData?.id || "")
        .order("published_at", { ascending: false })
        .limit(5);

    if (!featuredData) return null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
            {/* Hero Content - Desktop: Left 60%, Mobile: Top */}
            <div className="lg:col-span-8 h-[500px] lg:h-full relative rounded-2xl overflow-hidden group">
                <FeaturedArticle article={featuredData} />
            </div>

            {/* Sidebar / Quick Reads - Desktop: Right 40% */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
                <QuickReads articles={quickReadsData || []} />
            </div>
        </section>
    );
}
