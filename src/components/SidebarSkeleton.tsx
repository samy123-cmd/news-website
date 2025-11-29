import { Skeleton } from "@/components/ui/Skeleton";

export function SidebarSkeleton() {
    return (
        <aside className="space-y-8">
            {/* Newsletter CTA Skeleton */}
            <div className="h-48 rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center space-y-4">
                <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
            </div>

            {/* Related News Skeleton */}
            <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="w-5 h-5 rounded bg-white/10" />
                    <Skeleton className="h-6 w-40 bg-white/10" />
                </div>

                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="w-20 h-20 rounded-lg bg-white/10 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full bg-white/10" />
                            <Skeleton className="h-4 w-2/3 bg-white/10" />
                            <div className="flex gap-2 pt-1">
                                <Skeleton className="h-3 w-16 bg-white/10" />
                                <Skeleton className="h-3 w-16 bg-white/10" />
                            </div>
                        </div>
                    </div>
                ))}

                <Skeleton className="h-4 w-32 bg-white/10 mt-6" />
            </div>

            {/* Ad Skeleton */}
            <Skeleton className="w-full h-[250px] rounded-lg bg-white/5" />
        </aside>
    );
}
