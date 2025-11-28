"use client";

import { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ReaderModeToggle() {
    const [isReaderMode, setIsReaderMode] = useState(false);

    useEffect(() => {
        if (isReaderMode) {
            document.body.classList.add("reader-mode");
        } else {
            document.body.classList.remove("reader-mode");
        }
    }, [isReaderMode]);

    return (
        <Button
            variant={isReaderMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsReaderMode(!isReaderMode)}
            className={cn(
                "fixed bottom-4 left-4 z-50 rounded-full shadow-lg transition-all duration-300",
                isReaderMode ? "bg-primary text-primary-foreground" : "bg-background/80 backdrop-blur border border-border"
            )}
        >
            {isReaderMode ? (
                <>
                    <X className="w-4 h-4 mr-2" /> Exit Reader
                </>
            ) : (
                <>
                    <BookOpen className="w-4 h-4 mr-2" /> Reader Mode
                </>
            )}
        </Button>
    );
}
