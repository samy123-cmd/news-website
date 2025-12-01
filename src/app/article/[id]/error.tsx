'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Article Page Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-8">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center ring-1 ring-red-500/20">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold font-heading text-foreground">
                    Something went wrong
                </h2>
                <p className="text-muted-foreground">
                    We couldn't load this story. It might be a temporary glitch or a connection issue.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={reset}
                    variant="outline"
                    className="gap-2"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </Button>
                <Link href="/">
                    <Button className="gap-2">
                        <Home className="w-4 h-4" />
                        Back to Feed
                    </Button>
                </Link>
            </div>
        </div>
    );
}
