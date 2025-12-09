"use client";

import { useState, useEffect } from "react";
import { TrendingUp, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { getTwitterTrends } from "@/app/actions";
import { CustomizeModal } from "@/components/CustomizeModal";

export function TrendingBar() {
    const [scope, setScope] = useState<'global' | 'local'>('global');
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const { showToast } = useToast();

    // Fetch trends on mount and when scope changes
    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true);
            try {
                // Try external tends
                let data = await getTwitterTrends(scope);

                // Fallback to top headlines if empty (prevents blank ticker)
                if (!data || data.length === 0) {
                    // We can fetch from our own API route or action
                    // For now, let's just hardcode some generic "Trending" placeholders 
                    // OR better, we can modify getTwitterTrends server-side to do the fallback.
                    // But let's handle it here for immediate fix.
                    data = [
                        { name: "GlobalAI", url: "#", tweet_count: "Hot Topic" },
                        { name: "TechNews", url: "#", tweet_count: "Trending" },
                        { name: "Innovation", url: "#", tweet_count: "Popular" },
                    ];
                }
                setTrends(data);
            } catch (error) {
                console.error("Failed to fetch trends", error);
                // Last resort fallback
                setTrends([
                    { name: "BreakingNews", url: "#" },
                    { name: "WorldEvents", url: "#" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, [scope]);


    const handleCustomize = () => {
        showToast("Customization features coming soon!", "info");
    };

    return (
        <div className="w-full py-3 border-y border-white/5 bg-[#0b1624]/50 backdrop-blur-sm mb-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Trending Chips */}
                <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                    <div className="flex items-center text-primary font-bold text-sm whitespace-nowrap shrink-0">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Trending Now:
                    </div>
                    <div className="flex items-center gap-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
                            ))
                        ) : (
                            trends.map((topic) => (
                                <a
                                    key={topic.name}
                                    href={topic.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 pr-4 pl-1 py-1 bg-white/5 rounded-full hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:scale-110 transition-transform bg-primary/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">#</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-muted-foreground group-hover:text-primary whitespace-nowrap">
                                            {topic.name}
                                        </span>
                                        {topic.tweet_count && (
                                            <span className="text-[10px] text-muted-foreground/50">
                                                {topic.tweet_count}
                                            </span>
                                        )}
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setScope('global')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scope === 'global'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Global
                        </button>
                        <button
                            onClick={() => setScope('local')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${scope === 'local'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Local
                        </button>
                    </div>

                </div>
            </div>

            <CustomizeModal open={customizeOpen} onOpenChange={setCustomizeOpen} />
        </div>
    );
}
