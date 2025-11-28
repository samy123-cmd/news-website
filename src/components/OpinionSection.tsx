"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const OPINIONS = [
    {
        id: 1,
        author: "Sarah Jenkins",
        role: "Tech Analyst",
        title: "Why AI Regulation is Moving Too Slowly",
        excerpt: "The gap between technological advancement and legislative action is widening, creating a dangerous void that bad actors are eager to exploit.",
        image: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        id: 2,
        author: "Dr. Arinze Okafor",
        role: "Global Economics",
        title: "The Hidden Cost of Green Energy Transitions",
        excerpt: "While necessary, the shift to renewables is placing an unprecedented burden on developing nations that the global north has yet to address.",
        image: "https://i.pravatar.cc/150?u=arinze",
    },
    {
        id: 3,
        author: "Elena Rodriguez",
        role: "Cultural Critic",
        title: "Cinema in the Age of Algorithmic Content",
        excerpt: "When streaming services dictate what we watch based on data points, are we losing the serendipity that makes art truly transformative?",
        image: "https://i.pravatar.cc/150?u=elena",
    },
];

export function OpinionSection() {
    return (
        <section className="bg-secondary/30 py-16 rounded-3xl my-12">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Quote className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">Opinion & Analysis</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {OPINIONS.map((op, i) => (
                        <motion.div
                            key={op.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={op.image}
                                    alt={op.author}
                                    className="w-12 h-12 rounded-full border-2 border-background shadow-sm grayscale group-hover:grayscale-0 transition-all"
                                />
                                <div>
                                    <h4 className="font-bold text-sm">{op.author}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{op.role}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-serif font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                                {op.title}
                            </h3>

                            <p className="text-muted-foreground font-serif leading-relaxed text-sm line-clamp-3">
                                {op.excerpt}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
