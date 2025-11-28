"use client";

import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MegaFooter() {
    return (
        <footer className="bg-foreground text-background pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold font-heading">
                                AI
                            </div>
                            <h2 className="text-2xl font-heading font-bold">Global News</h2>
                        </div>
                        <p className="text-muted-foreground/80 text-sm leading-relaxed">
                            Empowering the world with real-time, AI-curated journalism.
                            Unbiased, fast, and premium.
                        </p>
                        <div className="flex gap-4">
                            <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-transparent">
                                <Twitter className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-transparent">
                                <Facebook className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-transparent">
                                <Instagram className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-transparent">
                                <Linkedin className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6">Sections</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground/80">
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
                        <h3 className="font-heading font-bold text-lg mb-6">Company</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground/80">
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
                        <h3 className="font-heading font-bold text-lg">Subscribe to our Newsletter</h3>
                        <p className="text-sm text-muted-foreground/80">
                            Get the latest headlines and AI-summarized briefs delivered to your inbox daily.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-background/10 border border-border/20 rounded-md px-3 py-2 text-sm text-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button size="sm">
                                <Mail className="w-4 h-4 mr-2" />
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
                    <p>© 2024 Global AI News. All rights reserved.</p>
                    <p>Designed with AI. Built for Humans.</p>
                </div>
            </div>
        </footer>
    );
}
