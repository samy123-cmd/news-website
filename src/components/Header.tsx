
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

    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
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
            featured: { title: "UN Summit Reaches Historic Climate Deal", image: "https://images.unsplash.com/photo-1569163139599-0f4517e36b51?w=400&q=80" }
        },
        {
            name: "Business",
            href: "/?category=Business",
            subcategories: ["Markets", "Tech", "Economy", "Startups"],
            featured: { title: "Tech Giants Report Record Q4 Earnings", image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&q=80" }
        },
        {
            name: "Tech",
            href: "/?category=Technology",
            subcategories: ["AI", "Cybersecurity", "Gadgets", "Space"],
            featured: { title: "The Next Generation of Quantum Processors", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" }
        },
        { name: "Entertainment", href: "/?category=Entertainment" },
        { name: "Sports", href: "/?category=Sports" },
        { name: "Science", href: "/?category=Science" },
        { name: "Opinion", href: "/?category=Opinion" },
    ];

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full transition-all duration-500 border-b border-transparent",
                isScrolled ? "bg-[#0b1624]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] py-3" : "bg-transparent py-5"
            )}
            onMouseLeave={() => setActiveDropdown(null)}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between relative h-16 lg:h-auto">
                    {/* Left: Logo & Date */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                                <div className="absolute inset-0 bg-primary rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-50 blur-sm" />
                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
                                    AI
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading font-bold text-2xl lg:text-3xl tracking-tight text-foreground leading-none">
                                    Global News
                                </span>
                                <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-primary font-bold mt-0.5">
                                    Premium Edition
                                </span>
                            </div>
                        </Link>

                        <div className="hidden xl:flex items-center gap-4 pl-8 border-l border-white/10 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-primary/70" />
                                <span className="font-medium">{currentDate}</span>
                            </div>
                            <LocationWeather />
                        </div>
                    </div>

                    {/* Center: Mega Nav */}
                    <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm relative z-50">
                        {navLinks.map((link) => {
                            const isActive = currentCategory === link.name || (link.name === "World" && !currentCategory);
                            return (
                                <div
                                    key={link.name}
                                    onMouseEnter={() => link.subcategories && setActiveDropdown(link.name)}
                                    className="relative"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setActiveDropdown(null)}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-bold transition-all duration-300 flex items-center gap-1.5 rounded-full group",
                                            isActive
                                                ? "text-white bg-primary/20 shadow-[0_0_10px_rgba(30,167,255,0.2)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        {link.name}
                                        {link.subcategories && (
                                            <ChevronDown className={cn(
                                                "w-3 h-3 transition-transform duration-300 opacity-50",
                                                activeDropdown === link.name ? "rotate-180 opacity-100" : "group-hover:opacity-100"
                                            )} />
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all duration-300 hover:border-primary/30 hover:bg-white/10 text-muted-foreground hover:text-foreground w-48"
                        >
                            <Search className="w-4 h-4" />
                            <span className="text-sm">Search news...</span>
                            <span className="ml-auto text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/5">⌘K</span>
                        </button>
                        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                        <Link
                            href="/submit"
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Submit Article
                        </Link>

                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6 font-bold relative overflow-hidden group">
                            <span className="relative z-10">Subscribe</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
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
                        <div className="container mx-auto px-4 py-8">
                            <div className="grid grid-cols-12 gap-8">
                                {/* Subcategories */}
                                <div className="col-span-3 border-r border-white/5 pr-8">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                                        Explore {activeDropdown}
                                    </h4>
                                    <ul className="space-y-2">
                                        {navLinks.find(l => l.name === activeDropdown)?.subcategories?.map((sub, idx) => (
                                            <motion.li
                                                key={sub}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <Link
                                                    href={`/?category=${activeDropdown}&subcategory=${sub}`}
                                                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all block py-1"
                                                >
                                                    {sub}
                                                </Link>
                                            </motion.li>
                                        ))}
                                        <li className="pt-2">
                                            <Link href={`/?category=${activeDropdown}`} className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                                                View All <ChevronDown className="w-3 h-3 -rotate-90" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Featured Story */}
                                <div className="col-span-6">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                                        Top Story
                                    </h4>
                                    {(() => {
                                        const link = navLinks.find(l => l.name === activeDropdown);
                                        return link?.featured ? (
                                            <div className="group cursor-pointer relative h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={link.featured.image}
                                                    alt={link.featured.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">
                                                        {link.featured.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>

                                {/* Quick Links / Ad */}
                                <div className="col-span-3 pl-8 border-l border-white/5">
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
                                        <h5 className="text-sm font-bold text-white mb-2">Premium Access</h5>
                                        <p className="text-xs text-muted-foreground mb-3">Get unlimited access to all articles and exclusive content.</p>
                                        <Button size="sm" variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-white transition-all">
                                            Start Free Trial
                                        </Button>
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
                                <Button className="w-full justify-center h-12 bg-primary text-white font-bold shadow-lg shadow-primary/20">Subscribe Now</Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
