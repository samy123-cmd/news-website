import { Suspense } from "react";
import { NewsFeed } from "@/components/NewsFeed";
import { HeroSection } from "@/components/HeroSection";
import { Ticker } from "@/components/Ticker";
import { CategoryPills } from "@/components/CategoryPills";
import { OpinionSection } from "@/components/OpinionSection";
import { MegaFooter } from "@/components/MegaFooter";
import { AdUnit } from "@/components/monetization/AdUnit";
import { SubscriptionBanner } from "@/components/monetization/SubscriptionBanner";
import { SponsoredNewsCard } from "@/components/monetization/SponsoredNewsCard";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ReaderModeToggle } from "@/components/ui/ReaderModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";

// Mock Categories (In real app, fetch from DB)
const CATEGORIES = [
  { name: "World", subcategories: ["Politics", "Conflict", "Climate"] },
  { name: "Business", subcategories: ["Markets", "Tech", "Economy"] },
  { name: "Technology", subcategories: ["AI", "Space", "Gadgets"] },
  { name: "Sports", subcategories: ["Cricket", "Football", "Tennis"] },
  { name: "Entertainment", subcategories: ["Bollywood", "Hollywood", "Music"] },
];

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomeProps) {
  const category = (searchParams.category as string) || "All";
  const subcategory = (searchParams.subcategory as string) || "All";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <ScrollProgress />
      <ReaderModeToggle />

      <div className="ticker-container">
        <Ticker />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-heading">
              AI
            </div>
            <h1 className="text-xl font-heading font-bold">Global News</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {/* We can make these links too if we want, but CategoryPills handles the main nav now */}
            <span className="text-foreground font-bold">Trending</span>
            <LanguageToggle />
          </nav>
          <div className="w-8 md:hidden">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12 flex-grow">
        {/* Only show Hero on "All" view to keep it clean */}
        {category === "All" && (
          <>
            <HeroSection />
            <div className="ad-unit">
              <AdUnit slotId="hero-banner" className="mx-auto" />
            </div>
          </>
        )}

        <section className="space-y-6">
          <div className="space-y-4 border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-heading font-bold tracking-tight">
                {category === "All" ? "Latest Stories" : category}
              </h2>
              <span className="text-sm text-muted-foreground">
                {subcategory !== "All" ? subcategory : "Real-time updates"}
              </span>
            </div>

            <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded-full w-full max-w-md" />}>
              <CategoryPills categories={CATEGORIES} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 news-grid">
              <Suspense fallback={<NewsFeedSkeleton />}>
                <NewsFeed category={category} subcategory={subcategory} />
              </Suspense>
            </div>
            <div className="space-y-8 sidebar-content">
              {/* Sidebar Ads & Sponsored */}
              <div className="ad-unit">
                <AdUnit slotId="sidebar-top" format="rectangle" />
              </div>

              <div className="sponsored-card">
                <SponsoredNewsCard
                  article={{
                    id: "sp-1",
                    title: "The Future of FinTech: Investing in 2025",
                    summary: "Discover how AI is reshaping the financial landscape and what it means for your portfolio.",
                    sponsorName: "WealthGen AI",
                    image_url: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&q=80",
                    url: "#",
                    sponsorLogo: "https://ui-avatars.com/api/?name=WG&background=0D8ABC&color=fff"
                  }}
                />
              </div>

              <div className="ad-unit sticky top-24">
                <AdUnit slotId="sidebar-sticky" format="vertical" />
              </div>
            </div>
          </div>
        </section>

        {/* Opinion Section - Only on Home */}
        {category === "All" && <OpinionSection />}

        <SubscriptionBanner />
      </div>

      <MegaFooter />
    </main>
  );
}
