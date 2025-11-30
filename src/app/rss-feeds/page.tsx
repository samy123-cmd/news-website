import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "RSS Feeds | AI Global News",
    description: "Subscribe to our content feeds.",
};

export default function RssFeedsPage() {
    const feeds = [
        { name: "Top Headlines", url: "https://aiglobalnews.com/rss/top" },
        { name: "World News", url: "https://aiglobalnews.com/rss/world" },
        { name: "Technology", url: "https://aiglobalnews.com/rss/technology" },
        { name: "Business", url: "https://aiglobalnews.com/rss/business" },
        { name: "Science", url: "https://aiglobalnews.com/rss/science" },
    ];

    return (
        <TextPageLayout
            title="RSS Feeds"
            subtitle="Stay updated with your favorite RSS reader."
        >
            <p>
                We provide standard RSS 2.0 feeds for all our major categories. You can add these URLs to any RSS reader like Feedly, Reeder, or NewsBlur.
            </p>

            <div className="space-y-4 not-prose mt-8">
                {feeds.map((feed) => (
                    <div key={feed.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                            <Rss className="w-5 h-5 text-orange-500" />
                            <div>
                                <h4 className="font-bold text-white">{feed.name}</h4>
                                <p className="text-xs text-muted-foreground font-mono">{feed.url}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(feed.url)}>
                            Copy URL
                        </Button>
                    </div>
                ))}
            </div>
        </TextPageLayout>
    );
}
