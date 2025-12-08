"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Globe, Award, Sparkles } from "lucide-react";

export function SubmitPromo() {
    return (
        <section className="relative py-16 overflow-hidden">
            {/* Background Decor - Media Centric: Ink Navy/Deep Blue instead of neon */}
            <div className="absolute inset-0 bg-[#0a192f] transform origin-top-left" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden group bg-[#112240]/50 backdrop-blur-md">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/10 text-blue-200 text-sm font-medium mb-4 border border-blue-200/20">
                                    <Globe className="w-3 h-3" />
                                    Citizen Journalism Network
                                </span>
                                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
                                    Your Story Matters.<br />
                                    <span className="text-blue-300">Share it With the World.</span>
                                </h2>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg text-gray-300 font-light leading-relaxed"
                            >
                                Join thousands of community reporters bringing real stories from real places. Our editor team helps refine your draft, while AI tools support clarity — your voice stays authentically yours.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <div className="p-2 rounded-full bg-blue-500/10">
                                        <Globe className="w-4 h-4 text-blue-300" />
                                    </div>
                                    <span>Global Impact</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <div className="p-2 rounded-full bg-blue-500/10">
                                        <Award className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Verified Badges</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <div className="p-2 rounded-full bg-blue-500/10">
                                        <Sparkles className="w-4 h-4 text-blue-300" />
                                    </div>
                                    <span>Editorial Support</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="pt-4"
                            >
                                <Link
                                    href="/submit"
                                    className="inline-flex items-center gap-2 bg-white text-[#0a192f] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-xl"
                                >
                                    Start Reporting
                                    <Send className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>

                        <div className="relative hidden md:block">
                            {/* Visual: Abstract Journalism Dashboard / Draft */}
                            <div className="relative z-10 p-8 bg-white rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <div>
                                            <div className="h-3 bg-gray-800 rounded w-24 mb-1"></div>
                                            <div className="h-2 bg-gray-400 rounded w-16"></div>
                                        </div>
                                        <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Live</div>
                                    </div>
                                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <span className="font-semibold text-blue-600">Editorial Assistant</span>
                                            <div className="text-gray-400">Fixed 3 grammatical errors</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
