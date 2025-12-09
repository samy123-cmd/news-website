'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, Bookmark, Search, Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
    variant: 'bookmarks' | 'search' | 'topic' | 'generic';
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    className?: string;
}

const variantConfig: Record<string, { icon: LucideIcon; title: string; description: string; actionLabel: string; actionHref: string }> = {
    bookmarks: {
        icon: Bookmark,
        title: "No bookmarks yet",
        description: "Save articles you want to read later by clicking the bookmark icon on any news card.",
        actionLabel: "Browse Latest News",
        actionHref: "/"
    },
    search: {
        icon: Search,
        title: "No results found",
        description: "We couldn't find any articles matching your search. Try different keywords or browse our categories.",
        actionLabel: "Explore Categories",
        actionHref: "/"
    },
    topic: {
        icon: Folder,
        title: "No articles in this topic",
        description: "We don't have any articles for this topic yet. Check back soon or explore other topics.",
        actionLabel: "View All Topics",
        actionHref: "/"
    },
    generic: {
        icon: Folder,
        title: "Nothing here",
        description: "There's no content to display at the moment.",
        actionLabel: "Go Home",
        actionHref: "/"
    }
};

export function EmptyState({
    variant = 'generic',
    title,
    description,
    actionLabel,
    actionHref,
    className
}: EmptyStateProps) {
    const config = variantConfig[variant] || variantConfig.generic;
    const Icon = config.icon;

    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActionLabel = actionLabel || config.actionLabel;
    const finalActionHref = actionHref || config.actionHref;

    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in",
            className
        )}>
            {/* Icon with subtle animation */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse-slow" />
                <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-muted-foreground" />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2">
                {finalTitle}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
                {finalDescription}
            </p>

            {/* Action Button */}
            <Link href={finalActionHref}>
                <Button
                    variant="outline"
                    className="group border-white/10 hover:border-primary/30 hover:bg-primary/5"
                >
                    {finalActionLabel}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>
    );
}
