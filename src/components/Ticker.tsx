"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function Ticker() {
    const breakingNews = [
        "Global markets rally as inflation data shows cooling trends...",
        "SpaceX announces new mission to Mars scheduled for 2026...",
        "Major breakthrough in renewable energy storage technology...",
        "International summit on climate change begins in Geneva...",
    ];

    return (
        <div className="bg-primary text-primary-foreground py-2 overflow-hidden flex items-center relative z-40">
            <div className="container mx-auto px-4 flex items-center">
                <div className="flex items-center font-bold text-xs uppercase tracking-wider mr-4 whitespace-nowrap bg-primary z-10 pr-4">
                    <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
                    Breaking
                </div>
                <div className="flex-1 overflow-hidden relative mask-linear-fade">
                    <motion.div
                        className="flex whitespace-nowrap gap-16 text-sm font-medium"
                        animate={{ x: ["0%", "-100%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30,
                        }}
                    >
                        {[...breakingNews, ...breakingNews].map((news, i) => (
                            <span key={i} className="inline-flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 mr-3" />
                                {news}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
