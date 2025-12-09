"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Activity } from "lucide-react";

interface SentimentMeterProps {
    sentiment: string;
    className?: string;
}

export function SentimentMeter({ sentiment, className }: SentimentMeterProps) {
    // Normalize sentiment
    const s = sentiment?.toLowerCase() || "neutral";

    const config = {
        positive: {
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            icon: TrendingUp,
            label: "Positive Outlook",
            desc: "AI detects optimistic market/social signals."
        },
        negative: {
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            icon: TrendingDown,
            label: "Critical / Negative",
            desc: "AI detects concern or downward trends."
        },
        neutral: {
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: Minus,
            label: "Neutral / Balanced",
            desc: "Facts presented without strong bias."
        },
        controversial: {
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            icon: AlertTriangle,
            label: "Controversial",
            desc: "Subject of intense public debate."
        }
    };

    const type = Object.keys(config).find(key => s.includes(key)) as keyof typeof config || "neutral";
    const { color, bg, border, icon: Icon, label, desc } = config[type];

    return (
        <div className={cn("rounded-xl border p-4 backdrop-blur-sm", bg, border, className)}>
            <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg bg-background/50 border border-white/5", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            AI Index
                        </span>
                    </div>
                    <h4 className={cn("font-bold text-sm mb-1", color)}>{label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {desc}
                    </p>
                </div>
            </div>

            {/* Meter Visual */}
            <div className="mt-3 h-1.5 w-full bg-background/50 rounded-full overflow-hidden flex">
                <div className={cn("h-full transition-all duration-1000 w-1/3 bg-transparent")} /> {/* Spacer */}
                <div className={cn("h-full rounded-full transition-all duration-1000 w-1/3",
                    type === 'positive' ? 'bg-emerald-500 ml-auto' :
                        type === 'negative' ? 'bg-rose-500 mr-auto' :
                            type === 'controversial' ? 'bg-amber-500 mx-auto w-full' :
                                'bg-blue-500 mx-auto'
                )} />
            </div>
        </div>
    );
}
