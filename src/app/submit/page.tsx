"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, Sparkles, Globe, Award, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
    "World", "Business", "Technology", "Entertainment", "Sports", "Science", "Health", "Opinion"
];

export default function SubmitPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(await res.text());

            setStatus('success');
            e.currentTarget.reset();
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage('Failed to submit article. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Effects - Editorial Navy */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: The Pitch (Sticky) */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/10 text-blue-200 text-sm font-medium mb-6 border border-blue-200/20">
                                <Globe className="w-3 h-3" />
                                Citizen Journalism Program
                            </span>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
                                Your Story, Your Voice,<br />
                                <span className="text-blue-400">Your Community.</span>
                            </h1>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Share events, culture, and moments from where you live. Our editors help you shape your article, with AI tools supporting clarity — but the voice is always yours.
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 h-fit">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Editorial Support</h3>
                                        <p className="text-sm text-gray-400">We help refine your draft. AI tools assist with grammar and clarity, but you retain full creative control.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                                    <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 h-fit">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Earn Recognition</h3>
                                        <p className="text-sm text-gray-400">Top contributors get a "Verified Reporter" badge and featured placement on the homepage.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                                    <div className="p-3 rounded-full bg-green-500/20 text-green-400 h-fit">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Editorial Review</h3>
                                        <p className="text-sm text-gray-400">Every submission is reviewed by our team to ensure quality and factual accuracy.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8 rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md"
                        >
                            {status === 'success' ? (
                                <div className="text-center py-20 space-y-6">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 animate-pulse">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Submission Received!</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Thank you for your contribution. Your article is now within our review queue. You'll receive an email once it's published.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Submit Another Story
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Your Name</label>
                                            <input
                                                name="author_name"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                                            <input
                                                name="author_email"
                                                type="email"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Article Headline</label>
                                        <input
                                            name="title"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-heading text-lg placeholder:text-gray-600"
                                            placeholder="Write a catchy headline..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Category</label>
                                        <select
                                            name="category"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex justify-between">
                                            <span>Content</span>
                                            <span className="text-xs text-primary flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                AI Assistant Enabled
                                            </span>
                                        </label>
                                        <textarea
                                            name="content"
                                            required
                                            rows={12}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-gray-600 leading-relaxed"
                                            placeholder="Start writing your story here. Don't worry about perfect formatting—our AI will help polish it..."
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                            <AlertCircle className="w-5 h-5" />
                                            <p className="text-sm">{errorMessage}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-[#0a192f] hover:bg-gray-100 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Submit Story for Review
                                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        By submitting, you agree to our editorial guidelines.
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
