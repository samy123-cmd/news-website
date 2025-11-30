import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Advertisers | AI Global News",
    description: "Partner with us to reach a global audience.",
};

export default function AdvertisersPage() {
    return (
        <TextPageLayout
            title="Advertise with Us"
            subtitle="Reach a highly engaged, global audience of decision-makers and innovators."
        >
            <h2>Why Advertise?</h2>
            <p>
                AI Global News offers a unique opportunity to connect with a premium audience. Our readers are tech-savvy, informed, and looking for the latest trends in business, technology, and global affairs.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                    <h3 className="text-3xl font-bold text-primary mb-2">5M+</h3>
                    <p className="text-muted-foreground">Monthly Active Users</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                    <h3 className="text-3xl font-bold text-primary mb-2">150+</h3>
                    <p className="text-muted-foreground">Countries Reached</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                    <h3 className="text-3xl font-bold text-primary mb-2">12m</h3>
                    <p className="text-muted-foreground">Avg. Session Duration</p>
                </div>
            </div>

            <h2>Ad Formats</h2>
            <ul>
                <li><strong>Native Articles:</strong> Sponsored content that blends seamlessly with our editorial feed.</li>
                <li><strong>Newsletter Sponsorships:</strong> Reach our subscribers directly in their inbox.</li>
                <li><strong>Display Ads:</strong> High-impact placements across our website and mobile apps.</li>
            </ul>

            <div className="mt-12 p-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-white/10 text-center not-prose">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to grow your brand?</h3>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold">
                    Download Media Kit
                </Button>
            </div>
        </TextPageLayout>
    );
}
