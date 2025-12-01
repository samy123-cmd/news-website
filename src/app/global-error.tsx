'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="bg-background text-foreground min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-center text-center space-y-8 max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center ring-1 ring-red-500/20">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-heading">
                            Critical System Error
                        </h2>
                        <p className="text-muted-foreground">
                            Our servers encountered an unexpected issue. We've been notified and are working on a fix.
                        </p>
                    </div>

                    <Button onClick={reset} className="gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Reload Application
                    </Button>
                </div>
            </body>
        </html>
    );
}
