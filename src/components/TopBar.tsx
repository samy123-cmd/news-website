
"use client";

import { AlertCircle, Globe, Search, User } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopBar() {
    const breakingNews = [
        "Global markets rally as inflation data shows cooling trends...",
        "SpaceX announces new mission to Mars scheduled for 2026...",
        "Major breakthrough in renewable energy storage technology...",
        "International summit on climate change begins in Geneva...",
    ];

    const [isPaused, setIsPaused] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [region, setRegion] = useState("Global");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="w-full h-9 bg-[#0b1624] border-b border-white/5 flex items-center justify-between px-4 z-50 relative text-[11px] font-medium text-muted-foreground tracking-wide">
            {/* Left: Date & Ticker */}
            <div className="flex items-center flex-1 overflow-hidden gap-6">
                {/* Date */}
                {/* Date removed - moved to Header */}

                {/* Ticker */}
                <div
                    className="flex items-center flex-1 overflow-hidden group mask-linear-fade"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex items-center text-accent/90 shrink-0 mr-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse mr-2" />
                        <span className="uppercase tracking-widest font-bold text-[9px]">Trending</span>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <div
                            className="flex whitespace-nowrap gap-12 text-white/70 animate-ticker font-serif italic"
                            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                        >
                            {[...breakingNews, ...breakingNews, ...breakingNews].map((news, i) => (
                                <span key={i} className="inline-flex items-center cursor-pointer hover:text-white transition-colors">
                                    {news}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Utilities */}
            <div className="flex items-center gap-5 shrink-0 pl-6 border-l border-white/5 h-full">
                {/* Region Selector */}
                <div className="relative group h-full flex items-center">
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors group-hover:text-primary">
                        <span className="uppercase tracking-widest text-[9px] font-bold">Edition:</span>
                        <span className="text-white font-serif">{region}</span>
                        <Globe className="w-3 h-3 ml-0.5 opacity-50" />
                    </button>
                    {/* Hover Dropdown */}
                    <div className="absolute top-full right-0 mt-0 pt-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-[#0b1624] border border-white/10 rounded-sm shadow-2xl py-1">
                            {['Global', 'India', 'USA'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRegion(r)}
                                    className={cn(
                                        "w-full text-left px-4 py-2 hover:bg-white/5 transition-colors block font-serif text-sm",
                                        region === r ? "text-primary" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Language Toggle with simplified aesthetic */}
                <div className="flex items-center gap-2">
                    <LanguageToggle />
                </div>

                {/* Search - Expandable */}
                <div className="flex items-center border-l border-white/10 pl-5 gap-2">
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-transparent border-b border-white/20 px-0 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 font-serif"
                                autoFocus={isSearchOpen}
                            />
                        </form>
                    </div>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={`hover:text-white transition-colors ${isSearchOpen ? 'text-primary' : ''}`}
                        aria-label="Search"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* User Action */}
                <button className="hover:text-white transition-colors border-l border-white/10 pl-5" aria-label="User Profile">
                    <User className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
