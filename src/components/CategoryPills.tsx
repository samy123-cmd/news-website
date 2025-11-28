"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryPillsProps {
    categories: {
        name: string;
        subcategories: string[];
    }[];
}

export function CategoryPills({ categories }: CategoryPillsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get("category") || "All";
    const activeSubcategory = searchParams.get("subcategory") || "All";

    const activeCategoryData = categories.find((c) => c.name === activeCategory);

    const updateParams = (cat: string, sub: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat) params.set("category", cat);
        if (sub) params.set("subcategory", sub);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Main Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <Button
                    variant={activeCategory === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateParams("All", "All")}
                    className="rounded-full"
                >
                    All News
                </Button>
                {categories.map((cat) => (
                    <Button
                        key={cat.name}
                        variant={activeCategory === cat.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateParams(cat.name, "All")}
                        className="rounded-full whitespace-nowrap"
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Subcategories (only if a category is selected) */}
            {activeCategory !== "All" && activeCategoryData && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar animate-in fade-in slide-in-from-top-2">
                    <Button
                        variant={activeSubcategory === "All" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => updateParams(activeCategory, "All")}
                        className="rounded-full text-xs h-7"
                    >
                        All {activeCategory}
                    </Button>
                    {activeCategoryData.subcategories.map((sub) => (
                        <Button
                            key={sub}
                            variant={activeSubcategory === sub ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => updateParams(activeCategory, sub)}
                            className="rounded-full text-xs h-7 whitespace-nowrap"
                        >
                            {sub}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
