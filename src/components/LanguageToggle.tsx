"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("en")}
                className={cn(
                    "h-7 px-3 text-xs font-bold rounded-md transition-all",
                    language === "en" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                EN
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("hi")}
                className={cn(
                    "h-7 px-3 text-xs font-bold rounded-md transition-all font-heading",
                    language === "hi" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                हिन्दी
            </Button>
        </div>
    );
}
