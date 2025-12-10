"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
    slotId: string;
    format?: "horizontal" | "vertical" | "rectangle" | "auto";
    className?: string;
    style?: React.CSSProperties;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export function AdUnit({ slotId, format = "auto", className, style }: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const [isAdLoaded, setIsAdLoaded] = useState(false);

    useEffect(() => {
        try {
            if (adRef.current && !adRef.current.innerHTML) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setIsAdLoaded(true);
            }
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [slotId]);

    // Dimensions guide for min-height to prevent CLS
    const getMinHeight = () => {
        if (style?.minHeight) return style.minHeight;
        switch (format) {
            case "horizontal": return "90px"; // Leaderboard
            case "vertical": return "600px"; // Skyscraper
            case "rectangle": return "250px"; // MPU/Rect
            default: return "250px"; // Safe default
        }
    };

    if (process.env.NODE_ENV === "development") {
        return (
            <div
                className={cn(
                    "bg-muted/30 border border-border/50 rounded-lg flex flex-col items-center justify-center text-center overflow-hidden relative group",
                    className
                )}
                style={{ minHeight: getMinHeight(), ...style }}
            >
                <span className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">
                    Ad Unit ({format})
                </span>
                <div className="text-muted-foreground/30 text-sm font-medium">
                    Slot ID: {slotId}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn("text-center mx-auto overflow-hidden", className)}
            style={{ minHeight: getMinHeight() }}
        >
            <ins
                ref={adRef}
                className="adsbygoogle block"
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
                style={{ display: "block", ...style }}
            />
        </div>
    );
}
