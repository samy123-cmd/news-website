
"use client";

import { useState, useEffect } from "react";
import { CloudSun, MapPin } from "lucide-react";

export function LocationWeather() {
    const [location, setLocation] = useState<{ city: string; country: string } | null>(null);
    const [loading, setLoading] = useState(true);

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
            }
        }

        fetchLocation();
    }, []);

    if (loading) return <div className="animate-pulse w-24 h-4 bg-white/10 rounded" />;

    return (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{location?.city}, {location?.country}</span>
            </div>
            <div className="flex items-center gap-2">
                <CloudSun className="w-3.5 h-3.5 text-accent" />
                <span>22°C</span>
            </div>
        </div>
    );
}
