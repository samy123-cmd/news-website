"use client";

import { cn } from "@/lib/utils";

interface AdUnitProps {
    slotId: string;
    format?: "horizontal" | "vertical" | "rectangle";
    className?: string;
}

export function AdUnit({ slotId, format = "horizontal", className }: AdUnitProps) {
    // In a real app, this would integrate with Google AdSense or another ad network
    // For now, we render a placeholder that looks like a real ad slot

    return (
        <div
            className={cn(
                "bg-muted/30 border border-border/50 rounded-lg flex flex-col items-center justify-center text-center overflow-hidden relative group",
                format === "horizontal" && "w-full h-[90px] md:h-[250px]",
                format === "vertical" && "w-[300px] h-[600px]",
                format === "rectangle" && "w-[300px] h-[250px]",
                className
            )}
        >
            <div className="absolute inset-0 bg-stripes-gray opacity-5" />
            <span className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest mb-1">Advertisement</span>
            <div className="text-muted-foreground/30 text-sm font-medium">
                Ad Space ({slotId})
            </div>

            {/* Hover effect to simulate ad interaction or debug info */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs text-primary font-medium">Place Ad Here</span>
            </div>
        </div>
    );
}
