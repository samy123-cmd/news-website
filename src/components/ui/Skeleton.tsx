import { cn } from "@/lib/utils";

function Skeleton({
    className,
    shimmer = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
    return (
        <div
            className={cn(
                "rounded-md bg-muted/50",
                shimmer && "animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };

