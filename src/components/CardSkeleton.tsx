'use client';

import { cn } from '@/lib/utils';

interface CardSkeletonProps {
    variant?: 'default' | 'featured' | 'compact';
    className?: string;
}

export function CardSkeleton({ variant = 'default', className }: CardSkeletonProps) {
    if (variant === 'compact') {
        return (
            <div className={cn("flex gap-4 p-4 rounded-xl bg-card/50 border border-white/5 animate-pulse", className)}>
                <div className="w-20 h-20 rounded-lg bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                    <div className="flex gap-2 pt-1">
                        <div className="h-3 w-16 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'featured') {
        return (
            <div className={cn("rounded-2xl overflow-hidden bg-card border border-white/5 animate-pulse", className)}>
                <div className="aspect-video w-full bg-white/10" />
                <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-20 bg-white/10 rounded-full" />
                        <div className="h-6 w-24 bg-white/10 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-6 w-full bg-white/10 rounded" />
                        <div className="h-6 w-3/4 bg-white/10 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-5/6 bg-white/10 rounded" />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="h-8 w-8 rounded-full bg-white/10" />
                        <div className="h-4 w-24 bg-white/10 rounded" />
                        <div className="h-4 w-20 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    // Default card skeleton
    return (
        <div className={cn("rounded-xl overflow-hidden bg-card border border-white/5 animate-pulse", className)}>
            <div className="aspect-[16/10] w-full bg-white/10" />
            <div className="p-4 space-y-3">
                <div className="h-5 w-16 bg-white/10 rounded-full" />
                <div className="space-y-2">
                    <div className="h-5 w-full bg-white/10 rounded" />
                    <div className="h-5 w-2/3 bg-white/10 rounded" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
            </div>
        </div>
    );
}
