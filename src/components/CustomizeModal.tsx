"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";

const CATEGORIES = [
    "World",
    "Business",
    "Technology",
    "Entertainment",
    "Sports",
    "Science",
    "Health",
    "Opinion"
];

interface CustomizeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomizeModal({ open, onOpenChange }: CustomizeModalProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            // Load from cookie
            const saved = getCookie("user_categories");
            if (saved) {
                try {
                    setSelected(JSON.parse(saved as string));
                } catch (e) {
                    console.error("Failed to parse categories cookie", e);
                    setSelected([]);
                }
            } else {
                // Default to all if nothing saved
                setSelected(CATEGORIES);
            }
        }
    }, [open]);

    const toggleCategory = (category: string) => {
        setSelected(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSave = () => {
        // Save to cookie (expires in 365 days)
        setCookie("user_categories", JSON.stringify(selected), { maxAge: 60 * 60 * 24 * 365 });
        onOpenChange(false);
        router.refresh(); // Refresh to apply changes server-side
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading font-bold">Customize Your Feed</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Select the topics you want to see in your personalized feed.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Checkbox
                                id={category}
                                checked={selected.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <Label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Save Preferences
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
