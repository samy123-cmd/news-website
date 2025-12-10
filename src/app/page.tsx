import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { HeroSkeleton } from "@/components/HeroSkeleton";
import { NewsletterStrip } from "@/components/NewsletterStrip";
import { TrendingBar } from "@/components/TrendingBar";
import { NewsFeed } from "@/components/NewsFeed";

import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";
import { getLatestNews } from "./actions";
import { SubmitPromo } from "@/components/SubmitPromo";

export const revalidate = 30;

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}

export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const { category = "All" } = await searchParams;

  const title = category === "All"
    ? "Global AI News | Real-time AI-curated News"
    : `${category} News | Global AI News`;

  // Pre-fetch hero image for LCP hint via OG (browsers often discover this early)
  let heroImage = null;
  if (category === "All") {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("articles").select("image_url").not("image_url", "is", null).order("published_at", { ascending: false }).limit(1).single();
      heroImage = data?.image_url;
    } catch (e) {
      // Ignore
    }
  }

  return {
    title,
    description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real - time.`,
    openGraph: {
      title,
      description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real - time.`,
      type: 'website',
      images: heroImage ? [{ url: heroImage }] : [],
    },
  };
}

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Home({ searchParams }: HomeProps) {
  const { category = "All", subcategory = "All" } = await searchParams;

  // Fetch news based on category
  let initialArticles: any[] = [];
  let featuredArticle: any = null;
  let quickReadsArticles: any[] = []; // Fixed variable name to match usage

  const supabase = await createClient();

  if (category === "All") {
    // Parallelize detailed fetches only for Home
    const cookieStore = await cookies();
    const userCategoriesCookie = cookieStore.get("user_categories");
    let userCategories: string[] = [];

    if (userCategoriesCookie) {
      try {
        userCategories = JSON.parse(userCategoriesCookie.value);
      } catch (e) {
        console.error("Failed to parse user categories", e);
      }
    }

    // 1. Fetch Hero Data (Hoisted for LCP)
    const [featuredResult, quickReadsResult] = await Promise.all([
      supabase.from("articles").select("*").not("image_url", "is", null).order("published_at", { ascending: false }).limit(1).single(),
      supabase.from("articles").select("id, title, source, published_at, url").order("published_at", { ascending: false }).limit(6)
    ]);

    featuredArticle = featuredResult.data;
    let quickReadsRaw = (quickReadsResult.data || []) as any[];

    if (featuredArticle) {
      quickReadsArticles = quickReadsRaw.filter((a: any) => a.id !== featuredArticle.id).slice(0, 5);
    } else {
      quickReadsArticles = quickReadsRaw.slice(0, 5);
    }

    // 2. Fetch Feed Data
    if (userCategories.length > 0) {
      const promises = userCategories.map(cat => getLatestNews(cat.toLowerCase(), 6));
      const results = await Promise.all(promises);
      initialArticles = results.flat().sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else {
      const [politics, tech, sports] = await Promise.all([
        getLatestNews('politics', 6),
        getLatestNews('technology', 6),
        getLatestNews('sports', 6)
      ]);
      initialArticles = [...politics, ...tech, ...sports].sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
  } else {
    initialArticles = await getLatestNews(category.toLowerCase());
  }

  return (
    <div className="bg-background min-h-screen">

      {/* 1. SEO H1 Logic */}
      {category === "All" ? (
        <h1 className="sr-only">Global AI News - Real-time AI Curated Headlines</h1>
      ) : (
        <div className="container mx-auto px-4 pt-32 pb-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground relative inline-block">
            {category} News
            <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-primary rounded-full" />
          </h1>
        </div>
      )}

      {/* Hero Section (Only show on Home/All) - Suspense removed for LCP */}
      {category === "All" && featuredArticle && (
        <div className="container mx-auto px-4 pt-6 pb-8">
          <HeroSection featuredArticle={featuredArticle} quickReadsArticles={quickReadsArticles} />
        </div>
      )}

      {/* Trending Bar */}
      <div className="mt-16 relative z-10">
        <TrendingBar />
      </div>

      {/* Promote Submission Feature */}
      <SubmitPromo />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col gap-12">

          {/* News Feed */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-foreground relative inline-block">
                {category === "All" ? "Latest Headlines" : "More Stories"}
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full" />
              </h2>
              {category === "All" && (
                <Link
                  href="/headlines"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  See All
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            <Suspense fallback={<NewsFeedSkeleton />}>
              <NewsFeed category={category} subcategory={subcategory} limit={category === "All" ? 20 : 20} initialArticles={initialArticles} />
            </Suspense>
          </section>

        </div>

        {/* Newsletter Strip (Only show on Home/All) - Moved to bottom */}
        {category === "All" && (
          <div className="mt-8 mb-4">
            <NewsletterStrip />
          </div>
        )}
      </div>
    </div>
  );
}
