"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SponsoredArticle {
    id: string;
    title: string;
    summary: string;
    sponsorName: string;
    sponsorLogo?: string;
    image_url: string;
    url: string;
}

export function SponsoredNewsCard({ article }: { article: SponsoredArticle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col h-full overflow-hidden rounded-xl bg-card border-2 border-primary/20 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative"
        >
            {/* Sponsored Badge */}
            <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                Sponsored Content
            </div>

            <div className="relative h-48 bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                    {article.sponsorLogo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.sponsorLogo} alt={article.sponsorName} className="w-6 h-6 rounded-full bg-white p-0.5" />
                    )}
                    <span className="text-xs font-medium">Promoted by {article.sponsorName}</span>
                </div>
            </div>

            <div className="flex flex-col flex-grow p-5 space-y-3">
                <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed font-serif">
                    {article.summary}
                </p>

                <div className="pt-4 mt-auto">
                    <Button variant="default" size="sm" className="w-full gap-2" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read More <ExternalLink className="w-3 h-3" />
                        </a>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
