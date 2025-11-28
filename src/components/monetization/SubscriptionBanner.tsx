"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SubscriptionBanner() {
    return (
        <section className="py-12 container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-12"
            >
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" /> Premium Access
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
                            Unlock the Full Story with <span className="text-primary">Global+</span>
                        </h2>
                        <p className="text-muted-foreground/80 text-lg max-w-md">
                            Get exclusive deep-dive analysis, ad-free reading, and early access to our AI-powered features.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="font-bold text-base">
                                Start Free Trial
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                                View Plans
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="font-bold text-lg mb-4">What's included:</h3>
                        <ul className="space-y-3">
                            {[
                                "Ad-free browsing experience",
                                "Exclusive 'Opinion & Analysis' articles",
                                "Daily AI-curated executive briefs",
                                "Priority access to new features",
                                "Support independent journalism"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
