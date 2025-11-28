
"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function AIAnalysisBlock() {
    return (
        <section className="w-full py-16 my-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <div className="absolute -left-20 top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute -right-20 bottom-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 ring-1 ring-white/10">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">Deep Dive Analysis</h2>
                        <p className="text-sm text-muted-foreground font-medium">AI-synthesized intelligence on today&apos;s top story</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 bg-[#142235]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">

                    {/* Image Column */}
                    <div className="lg:col-span-5 relative h-80 lg:h-auto rounded-[20px] overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80"
                            alt="AI Analysis"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 shadow-lg">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">Analysis by Gemini Pro</p>
                                    <p className="text-[10px] text-white/70">Reviewed by Editorial Board</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:pr-12 space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-accent bg-accent/10 border border-accent/20 rounded-full uppercase tracking-wider">
                                Technology Shift
                            </span>
                            <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight mb-4">
                                The Global Shift to Quantum Computing: Why It Matters Now
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Recent breakthroughs in qubit stability have accelerated the timeline for commercial quantum computing. Major tech giants are racing to achieve quantum supremacy, which could revolutionize everything from drug discovery to financial modeling.
                            </p>
                        </div>

                        <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                            <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Key Takeaways
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    "Google and IBM announce 1000+ qubit processors.",
                                    "New error correction methods reduce noise by 40%.",
                                    "Financial sector expected to be the first major adopter."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-2">
                            <Button className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8 rounded-xl shadow-lg shadow-white/5 transition-all hover:scale-105">
                                Read Full Analysis <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
