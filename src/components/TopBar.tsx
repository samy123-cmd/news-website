
"use client";

import { AlertCircle, Globe, Search, User } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useState } from "react";

export function TopBar() {
    const breakingNews = [
        "Global markets rally as inflation data shows cooling trends...",
        "SpaceX announces new mission to Mars scheduled for 2026...",
        "Major breakthrough in renewable energy storage technology...",
        "International summit on climate change begins in Geneva...",
    ];

    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="w-full h-10 bg-[#0b1624] border-b border-white/5 flex items-center justify-between px-4 z-50 relative text-xs font-medium text-muted-foreground">
            {/* Left: Ticker */}
            <div
                className="flex items-center flex-1 overflow-hidden mr-8 group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-sm mr-3 whitespace-nowrap">
                    <AlertCircle className="w-3 h-3 mr-1.5 animate-pulse" />
                    <span className="uppercase tracking-wider font-bold text-[10px]">Breaking</span>
                </div>

                <div className="flex-1 overflow-hidden relative mask-linear-fade">
                    <div
                        className="flex whitespace-nowrap gap-12 text-foreground/90 animate-ticker"
                        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                    >
                        {[...breakingNews, ...breakingNews, ...breakingNews].map((news, i) => (
                            <span key={i} className="inline-flex items-center cursor-pointer hover:text-primary transition-colors">
                                {news}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-4 shrink-0">
                {/* Region Selector (Mock) */}
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Global</span>
                </button>

                <div className="h-3 w-px bg-white/10" />

                {/* Language Toggle */}
                <LanguageToggle />

                <div className="h-3 w-px bg-white/10" />

                {/* Search */}
                <button className="hover:text-primary transition-colors">
                    <Search className="w-3.5 h-3.5" />
                </button>

                {/* Profile */}
                <button className="hover:text-primary transition-colors">
                    <User className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
