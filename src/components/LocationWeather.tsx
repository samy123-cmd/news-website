
"use client";

import { useState, useEffect } from "react";
import { CloudSun, MapPin } from "lucide-react";

export function LocationWeather() {
    const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const [temp, setTemp] = useState(22);

    useEffect(() => {
        // Simulate or fetch location
        // In a real app, use an IP geolocation API
        async function fetchLocation() {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data.city && data.country_name) {
                    setLocation({ city: data.city, country: data.country_name });
                } else {
                    // Fallback
                    setLocation({ city: "London", country: "United Kingdom" });
                }
            } catch {
                // Fallback on error
                setLocation({ city: "New York", country: "USA" });
            } finally {
                setLoading(false);
                // Set a stable "random" temp between 10-25 once loaded
                setTemp(Math.floor(Math.random() * (25 - 10) + 10));
            }
        }

        fetchLocation();
    }, []);

    if (loading) return <div className="animate-pulse w-24 h-4 bg-white/10 rounded" />;

    return (
        <div className="flex items-center gap-3 text-xs font-medium text-foreground/80 border-l border-white/10 pl-6 h-full">
            <span className="hidden xl:inline">{location?.city}</span>
            <div className="flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-accent" />
                <span className="font-bold text-foreground">{temp}°C</span>
            </div>
        </div>
    );
}
