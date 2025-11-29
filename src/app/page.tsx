import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { HeroSkeleton } from "@/components/HeroSkeleton";
import { NewsletterStrip } from "@/components/NewsletterStrip";
import { TrendingBar } from "@/components/TrendingBar";
import { NewsFeed } from "@/components/NewsFeed";
import { AIAnalysisBlock } from "@/components/AIAnalysisBlock";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";
import { getLatestNews } from "./actions";

export const revalidate = 60;

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

  return {
    title,
    description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real - time.`,
    openGraph: {
      title,
      description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real - time.`,
      type: 'website',
    },
  };
}

import { cookies } from "next/headers";

export default async function Home({ searchParams }: HomeProps) {
  const { category = "All", subcategory = "All" } = await searchParams;

  // Fetch news based on category
  let initialArticles = [];
  if (category === "All") {
    // Check for user preferences
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

    if (userCategories.length > 0) {
      // Fetch news for selected categories
      // We'll fetch top 2 from each selected category to build a personalized feed
      const promises = userCategories.map(cat => getLatestNews(cat.toLowerCase()));
      const results = await Promise.all(promises);
      initialArticles = results.flat().sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else {
      // Default mix if no preferences
      const [politics, tech, sports] = await Promise.all([
        getLatestNews('politics'),
        getLatestNews('technology'),
        getLatestNews('sports')
      ]);
      initialArticles = [...politics, ...tech, ...sports].sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
  } else {
    initialArticles = await getLatestNews(category.toLowerCase());
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section (Only show on Home/All) */}
      {category === "All" && (
        <div className="container mx-auto px-4 pt-6 pb-8">
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
          </Suspense>
        </div>
      )}



      {/* Trending Bar */}
      <div className="mt-12">
        <TrendingBar />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col gap-12">

          {/* News Feed */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold text-foreground relative inline-block">
                {category === "All" ? "Latest Headlines" : category}
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

          {/* AI Analysis Block (Interspersed) */}
          {category === "All" && <AIAnalysisBlock />}

        </div>

        {/* Newsletter Strip (Only show on Home/All) - Moved to bottom */}
        {category === "All" && (
          <div className="mt-16 mb-8">
            <NewsletterStrip />
          </div>
        )}
      </div>
    </div>
  );
}
