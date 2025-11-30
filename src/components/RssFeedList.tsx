"use client";

import { Button } from "@/components/ui/Button";
import { Rss } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function RssFeedList() {
    const { showToast } = useToast();
    const feeds = [
        { name: "Top Headlines", url: "https://global-ai-news.com/rss/top" },
        { name: "World News", url: "https://global-ai-news.com/rss/world" },
        { name: "Technology", url: "https://global-ai-news.com/rss/technology" },
        { name: "Business", url: "https://global-ai-news.com/rss/business" },
        { name: "Science", url: "https://global-ai-news.com/rss/science" },
    ];

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        showToast("RSS URL copied to clipboard!", "success");
    };

    return (
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
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(feed.url)}>
                        Copy URL
                    </Button>
                </div>
            ))}
        </div>
    );
}
