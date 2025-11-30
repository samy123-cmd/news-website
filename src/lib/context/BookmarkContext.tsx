"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

export interface BookmarkedArticle {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    image_url?: string;
    category?: string;
    url: string;
}

interface BookmarkContextType {
    bookmarks: BookmarkedArticle[];
    addBookmark: (article: BookmarkedArticle) => void;
    removeBookmark: (articleId: string) => void;
    isBookmarked: (articleId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
    const { showToast } = useToast();
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("bookmarks");
        if (saved) {
            try {
                setBookmarks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse bookmarks", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage whenever bookmarks change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        }
    }, [bookmarks, isInitialized]);

    const addBookmark = (article: BookmarkedArticle) => {
        if (bookmarks.some((b) => b.id === article.id)) return;
        setBookmarks((prev) => [article, ...prev]);
        showToast("Article saved to bookmarks", "success");
    };

    const removeBookmark = (articleId: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== articleId));
        showToast("Article removed from bookmarks", "info");
    };

    const isBookmarked = (articleId: string) => {
        return bookmarks.some((b) => b.id === articleId);
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarkProvider");
    }
    return context;
}
