import { Skeleton } from "@/components/ui/Skeleton";

export function HeroSkeleton() {
    return (
        <div className="relative w-full min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden bg-muted/20 animate-pulse border border-white/5">
            {/* Background Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
                <div className="max-w-4xl space-y-6">
                    {/* Badge */}
                    <Skeleton className="h-8 w-32 rounded-full bg-white/10" />

                    {/* Title */}
                    <div className="space-y-3">
                        <Skeleton className="h-12 md:h-16 w-full max-w-3xl bg-white/10" />
                        <Skeleton className="h-12 md:h-16 w-2/3 max-w-2xl bg-white/10" />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3 w-24 bg-white/10" />
                                <Skeleton className="h-2 w-16 bg-white/10" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-px bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
