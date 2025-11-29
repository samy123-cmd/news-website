"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-heading font-bold text-foreground">Something went wrong</h2>
                <p className="text-muted-foreground">
                    We encountered an unexpected error. Our team has been notified.
                </p>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Refresh Page
                </Button>
                <Button onClick={() => reset()} variant="default">
                    Try Again
                </Button>
            </div>
        </div>
    );
}
