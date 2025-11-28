"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterStrip() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setMessage(data.message);
            setEmail("");

            // Reset status after 5 seconds
            setTimeout(() => {
                setStatus("idle");
                setMessage("");
            }, 5000);

        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    return (
        <div className="w-full bg-[#0b1624] border-y border-white/10 py-4 sticky top-16 z-40 shadow-2xl backdrop-blur-xl bg-opacity-95">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

                    {/* Text Content */}
                    <div className="flex items-center gap-3 text-center md:text-left">
                        <div className="p-2 bg-primary/10 rounded-lg hidden md:block">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm md:text-base">
                                Get the Daily AI Brief
                            </h3>
                            <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
                                Curated intelligence for the modern professional. Free.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="w-full md:w-auto flex-1 max-w-md">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center justify-center md:justify-end gap-2 text-green-400 font-medium p-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>{message}</span>
                                </motion.div>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="relative flex items-center gap-2"
                                >
                                    <div className="relative flex-1">
                                        <input
                                            type="email"
                                            placeholder="Enter your work email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === "loading"}
                                            className="w-full h-10 pl-4 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm transition-all"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                                    >
                                        {status === "loading" ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Subscribe <Send className="w-3 h-3" />
                                            </span>
                                        )}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                        {status === "error" && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute mt-1 text-xs text-red-400 flex items-center gap-1"
                            >
                                <AlertCircle className="w-3 h-3" /> {message}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
