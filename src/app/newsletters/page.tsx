import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
    title: "Newsletters | AI Global News",
    description: "Subscribe to our daily newsletters.",
};

export default function NewslettersPage() {
    return (
        <TextPageLayout
            title="Newsletters"
            subtitle="Get the most important stories delivered straight to your inbox."
        >
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl border border-white/10 not-prose mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">The Daily Briefing</h2>
                <p className="text-muted-foreground mb-6">
                    Start your day with a concise summary of what happened overnight. Our AI curates the top 5 stories you need to know, estimated read time: 3 minutes.
                </p>
                <div className="max-w-md">
                    <NewsletterForm />
                </div>
            </div>

            <h2>Other Newsletters</h2>
            <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Tech Weekly</h3>
                    <p className="text-sm text-muted-foreground mb-4">A deep dive into the week's biggest technology breakthroughs and trends.</p>
                    <button className="text-primary font-bold text-sm hover:underline">Subscribe &rarr;</button>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Market Watch</h3>
                    <p className="text-sm text-muted-foreground mb-4">Financial news, stock market analysis, and economic indicators.</p>
                    <button className="text-primary font-bold text-sm hover:underline">Subscribe &rarr;</button>
                </div>
            </div>
        </TextPageLayout>
    );
}
