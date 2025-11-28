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
            <div className="lg:col-span-9 h-full">
                <FeaturedArticle article={featuredData} />
            </div>
            <div className="lg:col-span-3 h-full">
                <QuickReads articles={quickReadsData || []} />
            </div>
        </section>
    );
}
