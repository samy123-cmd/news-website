"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    // Simple translation dictionary for UI elements
    const translations: Record<string, Record<Language, string>> = {
        "Latest Stories": { en: "Latest Stories", hi: "नवीनतम कहानियाँ" },
        "Trending": { en: "Trending", hi: "ट्रेंडिंग" },
        "Read More": { en: "Read More", hi: "और पढ़ें" },
        "Sponsored Content": { en: "Sponsored Content", hi: "प्रायोजित सामग्री" },
        "Premium Access": { en: "Premium Access", hi: "प्रीमियम एक्सेस" },
        "Start Free Trial": { en: "Start Free Trial", hi: "निःशुल्क परीक्षण शुरू करें" },
        "View Plans": { en: "View Plans", hi: "योजनाएं देखें" },
        "Opinion & Analysis": { en: "Opinion & Analysis", hi: "राय और विश्लेषण" },
        "Quick Read": { en: "Quick Read", hi: "जल्दी पढ़ें" },
        "min read": { en: "min read", hi: "मिनट पढ़ें" },
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
