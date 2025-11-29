"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "@/app/actions/analytics";

export function ViewTracker({ articleId }: { articleId: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            incrementView(articleId);
            hasTracked.current = true;
        }
    }, [articleId]);

    return null;
}
