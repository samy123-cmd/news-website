
"use client";

import { useState } from "react";
import { TrendingUp, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

export function TrendingBar() {
    const [scope, setScope] = useState<'global' | 'local'>('global');
    const { showToast } = useToast();

    const trendingTopics = [
        { name: "#SpaceX", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=100&q=80" },
        { name: "#Inflation", image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=100&q=80" },
        { name: "#WorldCup", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&q=80" },
        { name: "#AI", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&q=80" },
        { name: "#Climate", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&q=80" },
        { name: "#Crypto", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100&q=80" },
    ];

    const handleCustomize = () => {
        showToast("Customization features coming soon!", "info");
    };

    return (
        <div className="w-full py-6 border-y border-white/5 bg-[#0b1624]/50 backdrop-blur-sm mb-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Trending Chips */}
                <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                    <div className="flex items-center text-primary font-bold text-sm whitespace-nowrap shrink-0">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Trending Now:
                    </div>
                    <div className="flex items-center gap-4">
                        {trendingTopics.map((topic) => (
                            <button
                                key={topic.name}
                                className="group flex items-center gap-3 pr-4 pl-1 py-1 bg-white/5 rounded-full hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                    <Image
                                        src={topic.image}
                                        alt={topic.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary whitespace-nowrap">
                                    {topic.name}
                                </span>
                            </button>
                        ))}
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
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-primary gap-2"
                        onClick={handleCustomize}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Customize
                    </Button>
                </div>
            </div>
        </div>
    );
}
