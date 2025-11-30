import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Press Center | AI Global News",
    description: "Resources for media and press.",
};

export default function PressCenterPage() {
    return (
        <TextPageLayout
            title="Press Center"
            subtitle="Latest news, brand assets, and media resources for AI Global News."
        >
            <h2>Latest Announcements</h2>
            <div className="space-y-8 not-prose mb-12">
                {[
                    { date: "Nov 28, 2025", title: "AI Global News Launches Mobile App Beta", excerpt: "We are excited to announce the beta launch of our native iOS and Android apps." },
                    { date: "Oct 15, 2025", title: "Reaching 5 Million Monthly Users", excerpt: "A milestone achievement for our platform as we continue to grow globally." },
                    { date: "Sep 01, 2025", title: "Partnership with Major Global Publishers", excerpt: "New agreements ensure even faster and more reliable news ingestion." }
                ].map((item, i) => (
                    <div key={i} className="border-l-2 border-primary pl-6">
                        <p className="text-sm text-primary font-bold mb-1">{item.date}</p>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.excerpt}</p>
                    </div>
                ))}
            </div>

            <h2>Brand Assets</h2>
            <p>
                Download our official logos, screenshots, and executive headshots for use in media coverage.
            </p>

            <div className="grid md:grid-cols-2 gap-4 not-prose mt-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">Logo Pack</h4>
                        <p className="text-xs text-muted-foreground">SVG, PNG, EPS</p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-white">Media Kit</h4>
                        <p className="text-xs text-muted-foreground">PDF Presentation</p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </div>
            </div>

            <div className="mt-12">
                <h2>Media Contact</h2>
                <p>
                    For press inquiries, please contact <a href="mailto:press@aiglobalnews.com">press@aiglobalnews.com</a>.
                </p>
            </div>
        </TextPageLayout>
    );
}
