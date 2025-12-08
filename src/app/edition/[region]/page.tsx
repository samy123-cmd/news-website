import { NewsFeed } from "@/components/NewsFeed";
import { NewsFeedSkeleton } from "@/components/NewsFeedSkeleton";
import { Suspense } from "react";
import { notFound } from "next/navigation";

// Map slugs to display names and categories
import { REGIONS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

interface EditionPageProps {
    params: Promise<{
        region: string;
    }>;
}

export async function generateMetadata({ params }: EditionPageProps) {
    const { region } = await params;
    const data = REGIONS[region];

    if (!data) return { title: "Region Not Found" };

    const title = `${data.title} News | Global AI News`;
    const description = `Latest news and updates from ${data.title}, curated by AI.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            locale: "en_US",
            url: `/edition/${region}`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function EditionPage({ params }: EditionPageProps) {
    const { region } = await params;
    const data = REGIONS[region];

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="container mx-auto space-y-8">
                <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-bold">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Regional Edition
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                        {data.title}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Real-time coverage of the latest events and stories from {data.title}.
                    </p>
                </div>

                <Suspense fallback={<NewsFeedSkeleton />}>
                    <NewsFeed category={data.category} />
                </Suspense>
            </div>
        </div>
    );
}
