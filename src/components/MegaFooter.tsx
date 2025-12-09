"use client";

import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SubscriptionForm } from "./SubscriptionForm";

export function MegaFooter() {
    return (
        <footer className="bg-[#0b1624] text-foreground pt-16 pb-8 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 bg-primary rounded-xl rotate-3 opacity-50 blur-sm" />
                                <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/20">
                                    AI
                                </div>
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-white">Global News</h2>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering the world with real-time, AI-curated journalism.
                            Unbiased, fast, and premium.
                        </p>
                        <div className="flex gap-4">
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-white/5">
                                <Twitter className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-white/5">
                                <Facebook className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-white/5">
                                <Instagram className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-white/5">
                                <Linkedin className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6 text-white">Sections</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">World</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Business</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Technology</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Science</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Health</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Sports</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Entertainment</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6 text-white">Company</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Code of Ethics</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h3 className="font-heading font-bold text-lg text-white">Get the Daily AI Brief</h3>
                        <p className="text-sm text-muted-foreground">
                            5-minute AI-curated briefing of the top 5 stories. Join 25k+ professionals.
                        </p>
                        <SubscriptionForm />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2024 Global AI News. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
