import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
    title: "Developer API | AI Global News",
    description: "Access our news data programmatically.",
};

export default function DeveloperApiPage() {
    return (
        <TextPageLayout
            title="Developer API"
            subtitle="Build the next generation of news applications with our powerful API."
        >
            <div className="bg-[#0b1624] border border-white/10 rounded-xl p-6 mb-8 not-prose font-mono text-sm text-muted-foreground overflow-x-auto">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs opacity-50">bash</span>
                </div>
                <p className="text-primary">curl <span className="text-white">https://api.aiglobalnews.com/v1/headlines</span> \</p>
                <p className="pl-4">-H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \</p>
                <p className="pl-4">-d <span className="text-green-400">"category=technology&limit=5"</span></p>
            </div>

            <h2>Features</h2>
            <ul>
                <li><strong>Real-time Access:</strong> Get headlines as soon as they are published.</li>
                <li><strong>Advanced Filtering:</strong> Filter by category, region, sentiment, and more.</li>
                <li><strong>AI Metadata:</strong> Access AI-generated summaries, keywords, and entities.</li>
                <li><strong>High Reliability:</strong> 99.9% uptime SLA for enterprise plans.</li>
            </ul>

            <h2>Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
                    <p className="text-3xl font-bold text-white mb-4">$0<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                        <li>1,000 requests/mo</li>
                        <li>Rate limited</li>
                        <li>Community support</li>
                    </ul>
                    <Button variant="outline" className="w-full">Get Key</Button>
                </div>
                <div className="bg-primary/10 p-6 rounded-xl border border-primary/50 relative">
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                    <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                    <p className="text-3xl font-bold text-white mb-4">$49<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                        <li>100,000 requests/mo</li>
                        <li>Higher rate limits</li>
                        <li>Email support</li>
                    </ul>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90">Start Trial</Button>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                    <p className="text-3xl font-bold text-white mb-4">Custom</p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                        <li>Unlimited requests</li>
                        <li>Dedicated support</li>
                        <li>SLA Guarantee</li>
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                </div>
            </div>

            <p>
                Read the full <a href="#">API Documentation</a> to get started.
            </p>
        </TextPageLayout>
    );
}
