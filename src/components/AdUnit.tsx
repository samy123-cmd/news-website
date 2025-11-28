import { cn } from "@/lib/utils";

interface AdUnitProps {
    slotId: string;
    format?: "horizontal" | "rectangle" | "vertical";
    label?: string;
    className?: string;
}

export function AdUnit({ slotId, format = "horizontal", label = "Advertisement", className }: AdUnitProps) {
    return (
        <div className={cn("w-full my-8 flex flex-col items-center justify-center", className)}>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 opacity-60">
                {label}
            </span>
            <div
                className={cn(
                    "bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-muted-foreground text-xs font-medium overflow-hidden relative group",
                    format === "horizontal" && "w-full max-w-4xl h-[100px] md:h-[250px]",
                    format === "rectangle" && "w-full max-w-[300px] h-[250px]",
                    format === "vertical" && "w-full max-w-[160px] h-[600px]"
                )}
            >
                {/* Placeholder Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="z-10 text-center p-4">
                    <p>Ad Space ({slotId})</p>
                    <p className="opacity-50 text-[10px] mt-1">Responsive Slot</p>
                </div>

                {/* Hover Effect to indicate it's an interactive slot */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
