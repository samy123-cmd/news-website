import { createClient } from "@/lib/supabase/server";
import { HeadlinesLayout } from "@/components/HeadlinesLayout";
import { Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HeadlinesPage() {
    const supabase = await createClient();

    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(100);

    if (!articles?.length) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-16 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-heading font-bold text-foreground">No headlines found</h2>
                            <p className="text-muted-foreground max-w-md mx-auto text-lg">
                                Our AI is currently scanning the globe for the latest updates. Check back in a few minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="container mx-auto space-y-8">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                        All Headlines
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Browse through the latest stories curated by our AI from around the globe.
                    </p>
                </div>

                <HeadlinesLayout initialArticles={articles} />
            </div>
        </div>
    );
}
