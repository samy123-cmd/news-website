"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Globe, Download, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewsletterForm } from "@/components/NewsletterForm";

const EDITIONS = [
    { label: "United States", href: "/edition/united-states", description: "Local news and updates from the US" },
    { label: "India", href: "/edition/india", description: "Latest headlines and stories from India" },
    { label: "United Kingdom", href: "/edition/united-kingdom", description: "Breaking news from the UK" },
    { label: "Europe", href: "/edition/europe", description: "Comprehensive coverage of European affairs" },
    { label: "Asia Pacific", href: "/edition/asia-pacific", description: "Updates from the APAC region" },
    { label: "Middle East", href: "/edition/middle-east", description: "News and analysis from the Middle East" },
    { label: "Africa", href: "/edition/africa", description: "Stories and developments across Africa" },
];

const COMPANY_LINKS = [
    { label: "About Us", href: "/about-us", description: "Learn about our mission and values" },
    { label: "Careers", href: "/careers", description: "Join our team of innovators" },
    { label: "Code of Ethics", href: "/code-of-ethics", description: "Our commitment to unbiased journalism" },
    { label: "Privacy Policy", href: "/privacy-policy", description: "How we protect your data" },
    { label: "Terms of Service", href: "/terms-of-service", description: "Rules for using our platform" },
    { label: "Cookie Policy", href: "/privacy-policy", description: "Information about our cookie usage" },
    { label: "Accessibility", href: "/help-center", description: "Our commitment to inclusive design" },
    { label: "Contact Us", href: "/help-center", description: "Get in touch with our support team" },
];

const RESOURCE_LINKS = [
    { label: "Help Center", href: "/help-center", description: "Guides and FAQs for using the platform" },
    { label: "Sitemap", href: "/sitemap", description: "Overview of our website structure" },
    { label: "Advertisers", href: "/advertisers", description: "Partner with us for advertising" },
    { label: "Press Center", href: "/press-center", description: "Resources for media and press" },
    { label: "Developer API", href: "/developer-api", description: "Access our news data programmatically" },
    { label: "RSS Feeds", href: "/rss-feeds", description: "Subscribe to our content feeds" },
    { label: "Newsletters", href: "/newsletters", description: "Get daily updates in your inbox" },
];

const SOCIAL_LINKS = [
    { icon: Facebook, href: "#", label: "Facebook", description: "Follow us on Facebook" },
    { icon: Twitter, href: "#", label: "Twitter", description: "Follow us on X (Twitter)" },
    { icon: Instagram, href: "#", label: "Instagram", description: "See our stories on Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn", description: "Connect with us on LinkedIn" },
    { icon: Mail, href: "#", label: "Email", description: "Subscribe to our newsletter" },
];

export function Footer() {
    return (
        <TooltipProvider delayDuration={100}>
            <footer className="bg-[#08101a] border-t border-white/5 pt-20 pb-10 mt-24 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        {/* Brand & App */}
                        {/* Brand & App */}
                        <div className="lg:col-span-2 space-y-8 pr-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                                        AI
                                    </div>
                                    <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                                        Global News
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                                    The world&apos;s first AI-powered premium news aggregator. Delivering real-time, unbiased, and polished journalism from across the globe.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-sm font-bold text-foreground">Subscribe to our Newsletter</h5>
                                <NewsletterForm />
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-sm font-bold text-foreground">Get the App</h5>
                                <div className="flex gap-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-left flex items-center gap-3 transition-all hover:scale-105">
                                                <Smartphone className="w-6 h-6 text-primary" />
                                                <div className="flex flex-col items-start leading-none">
                                                    <span className="text-[10px] text-muted-foreground">Download on the</span>
                                                    <span className="text-sm font-bold">App Store</span>
                                                </div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>Download for iOS devices</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-left flex items-center gap-3 transition-all hover:scale-105">
                                                <Download className="w-6 h-6 text-primary" />
                                                <div className="flex flex-col items-start leading-none">
                                                    <span className="text-[10px] text-muted-foreground">Get it on</span>
                                                    <span className="text-sm font-bold">Google Play</span>
                                                </div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>Download for Android devices</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        {/* Links Column 1 */}
                        <div>
                            <h4 className="font-bold text-foreground mb-6">Editions</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {EDITIONS.map((item) => (
                                    <li key={item.label}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={item.href} className="group flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1">
                                                    <Globe className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    {item.label}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-[#0b1624] border-white/10">
                                                <p>{item.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Links Column 2 */}
                        <div>
                            <h4 className="font-bold text-foreground mb-6">Company</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {COMPANY_LINKS.map((item) => (
                                    <li key={item.label}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={item.href} className="group flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1">
                                                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                                    {item.label}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-[#0b1624] border-white/10">
                                                <p>{item.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Links Column 3 */}
                        <div>
                            <h4 className="font-bold text-foreground mb-6">Resources</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {RESOURCE_LINKS.map((item) => (
                                    <li key={item.label}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={item.href} className="group flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1">
                                                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary" />
                                                    {item.label}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="bg-[#0b1624] border-white/10">
                                                <p>{item.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} AI Global News. All rights reserved.</p>
                        <span className="hidden md:inline text-white/10">|</span>
                        <div className="flex gap-4">
                            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
                            <Link href="/sitemap" className="hover:text-foreground transition-colors">Sitemap</Link>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {SOCIAL_LINKS.map((social, i) => (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>{social.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </footer>
        </TooltipProvider>
    );
}
