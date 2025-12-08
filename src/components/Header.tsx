
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X, ChevronDown, Search, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LocationWeather } from "./LocationWeather";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SearchOverlay } from "./SearchOverlay";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Calculate reading progress
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(progress);
        };
        window.addEventListener("scroll", handleScroll);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const navLinks = [
        {
            name: "World",
            href: "/?category=World",
            subcategories: ["Politics", "Conflict", "Diplomacy", "Human Rights"],
        },
        {
            name: "India",
            href: "/?category=India",
            subcategories: ["Politics", "Elections", "Policy", "Culture"],
        },
        {
            name: "Business",
            href: "/?category=Business",
            subcategories: ["Markets", "Tech", "Economy", "Startups"],
        },
        {
            name: "Tech",
            href: "/?category=Technology",
            subcategories: ["AI", "Cybersecurity", "Gadgets", "Space"],
        },
        { name: "Entertainment", href: "/?category=Entertainment" },
        { name: "Sports", href: "/?category=Sports" },
        { name: "Science", href: "/?category=Science" },
        { name: "Opinion", href: "/?category=Opinion" },
    ];

    // Date moved to inline render
    // const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full transition-all duration-500 border-b border-transparent",
                isScrolled ? "bg-[#0b1624]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] py-3" : "bg-transparent py-5"
            )}
            onMouseLeave={() => setActiveDropdown(null)}
        >
            {/* Reading Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary w-full origin-left transform transition-transform duration-100 ease-out opacity-80" style={{ transform: `scaleX(${readingProgress / 100})` }} />

            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between relative h-16 lg:h-auto">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3 lg:gap-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-8 h-8 lg:w-9 lg:h-9">
                                <div className="absolute inset-0 bg-primary rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-50 blur-sm" />
                                <div className="relative w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
                                    AI
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading font-bold text-xl lg:text-2xl tracking-tight text-foreground leading-none">
                                    Global News
                                </span>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">
                                    Premium Edition
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Date & Weather Widget (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6 ml-8 pl-8 border-l border-white/10 h-10 mr-12">
                        <div className="flex flex-col justify-center">
                            <span className="text-xs font-bold text-foreground">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                Today's Paper
                            </span>
                        </div>
                        <LocationWeather />
                    </div>

                    {/* Center: Mega Nav */}
                    <nav className="hidden lg:flex items-center gap-8 relative z-50">
                        {navLinks.map((link) => {
                            const isActive = currentCategory === link.name || (link.name === "World" && !currentCategory);
                            return (
                                <div
                                    key={link.name}
                                    onMouseEnter={() => link.subcategories && setActiveDropdown(link.name)}
                                    className="relative group h-16 flex items-center"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setActiveDropdown(null)}
                                        className={cn(
                                            "relative text-sm font-bold transition-colors duration-300 flex items-center gap-1.5 tracking-wide",
                                            isActive
                                                ? "text-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span className="absolute bottom-4 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_rgba(56,189,248,0.5)] rounded-full" />
                                        )}
                                        {link.subcategories && (
                                            <ChevronDown className={cn(
                                                "w-3 h-3 transition-transform duration-300 opacity-40",
                                                activeDropdown === link.name ? "rotate-180 opacity-100" : "group-hover:opacity-100"
                                            )} />
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-4 ml-8 pl-8 border-l border-white/10">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 border border-white/5 hover:border-white/20 group"
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                        <div className="h-6 w-px bg-white/10" />



                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(30,167,255,0.3)] hover:shadow-[0_0_25px_rgba(30,167,255,0.5)] rounded-full px-5 h-9 text-xs font-bold uppercase tracking-widest relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-0.5">
                            <span className="relative z-10">Subscribe</span>
                        </Button>
                        <ThemeToggle />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-foreground p-3 -mr-2 active:bg-white/10 rounded-full transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Mobile Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {activeDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-full left-0 w-full bg-[#0b1624]/95 backdrop-blur-2xl border-t border-b border-white/10 shadow-2xl z-30 overflow-hidden"
                        onMouseEnter={() => setActiveDropdown(activeDropdown)}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <div className="container mx-auto px-4 py-6">
                            <div className="flex justify-center">
                                <div className="w-full max-w-2xl">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 text-center">
                                        Explore {activeDropdown}
                                    </h4>
                                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {navLinks.find(l => l.name === activeDropdown)?.subcategories?.map((sub, idx) => (
                                            <motion.li
                                                key={sub}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="text-center"
                                            >
                                                <Link
                                                    href={`/?category=${activeDropdown}&subcategory=${sub}`}
                                                    className="text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 px-3 py-2 rounded-lg transition-all block"
                                                >
                                                    {sub}
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <div className="mt-6 text-center border-t border-white/5 pt-4">
                                        <Link href={`/?category=${activeDropdown}`} className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-primary transition-colors">
                                            View All {activeDropdown} News <ChevronDown className="w-3 h-3 -rotate-90" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#0b1624] border-b border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-lg font-bold text-muted-foreground hover:text-primary py-3 border-b border-white/5 last:border-0"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="flex flex-col gap-3 mt-6">
                                <Link
                                    href="/submit"
                                    className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Submit Article
                                </Link>
                                <Button className="w-full justify-center h-12 bg-primary text-white font-bold shadow-lg shadow-primary/20">Subscribe Now</Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
