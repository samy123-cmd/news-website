'use client';

import { cn } from '@/lib/utils';

interface ArticleSkeletonProps {
    className?: string;
}

export function ArticleSkeleton({ className }: ArticleSkeletonProps) {
    return (
        <div className={cn("lg:col-span-8 animate-pulse", className)}>
            {/* Article Content Skeleton */}
            <article className="prose prose-invert max-w-none">
                {/* Summary Box */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-8">
                    <div className="h-5 w-24 bg-white/10 rounded mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-5/6 bg-white/10 rounded" />
                        <div className="h-4 w-4/5 bg-white/10 rounded" />
                    </div>
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-full bg-white/10 rounded" />
                            <div className="h-4 w-full bg-white/10 rounded" />
                            <div className="h-4 w-3/4 bg-white/10 rounded" />
                        </div>
                    ))}
                </div>

                {/* Subheading */}
                <div className="h-6 w-48 bg-white/10 rounded mt-8 mb-4" />

                {/* More Paragraphs */}
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-full bg-white/10 rounded" />
                            <div className="h-4 w-5/6 bg-white/10 rounded" />
                            <div className="h-4 w-full bg-white/10 rounded" />
                        </div>
                    ))}
                </div>

                {/* Read Time / Meta */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-4 w-32 bg-white/10 rounded" />
                </div>
            </article>
        </div>
    );
}
