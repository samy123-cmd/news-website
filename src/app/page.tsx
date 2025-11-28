
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TrendingBar } from "@/components/TrendingBar";
import { NewsFeed } from "@/components/NewsFeed";
import { AIAnalysisBlock } from "@/components/AIAnalysisBlock";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

export const dynamic = 'force-dynamic';

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
    description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real-time.`,
    openGraph: {
      title,
      description: `Stay updated with the latest ${category === "All" ? "global" : category} news, curated by AI in real-time.`,
      type: 'website',
    },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { category = "All", subcategory = "All" } = await searchParams;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section (Only show on Home/All) */}
      {category === "All" && (
        <div className="container mx-auto px-4 pt-6 pb-8">
          <Suspense fallback={<div className="h-[600px] bg-white/5 animate-pulse rounded-2xl" />}>
            <HeroSection />
          </Suspense>
        </div>
      )}

      {/* Trending Bar */}
      <TrendingBar />

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
              <NewsFeed category={category} subcategory={subcategory} limit={category === "All" ? 5 : 20} />
            </Suspense>
          </section>

          {/* AI Analysis Block (Interspersed) */}
          {category === "All" && <AIAnalysisBlock />}

        </div>
      </div>
    </div>
  );
}
