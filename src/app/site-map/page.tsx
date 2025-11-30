import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sitemap | AI Global News",
    description: "Overview of our website structure.",
};

export default function SitemapPage() {
    const sections = [
        {
            title: "Main",
            links: [
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about-us" },
                { label: "Careers", href: "/careers" },
                { label: "Contact Us", href: "/contact-us" },
            ]
        },
        {
            title: "Editions",
            links: [
                { label: "United States", href: "/edition/united-states" },
                { label: "India", href: "/edition/india" },
                { label: "United Kingdom", href: "/edition/united-kingdom" },
                { label: "Europe", href: "/edition/europe" },
                { label: "Asia Pacific", href: "/edition/asia-pacific" },
                { label: "Middle East", href: "/edition/middle-east" },
                { label: "Africa", href: "/edition/africa" },
            ]
        },
        {
            title: "Categories",
            links: [
                { label: "World", href: "/?category=World" },
                { label: "Business", href: "/?category=Business" },
                { label: "Technology", href: "/?category=Technology" },
                { label: "Entertainment", href: "/?category=Entertainment" },
                { label: "Sports", href: "/?category=Sports" },
                { label: "Science", href: "/?category=Science" },
                { label: "Health", href: "/?category=Health" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "Code of Ethics", href: "/code-of-ethics" },
            ]
        }
    ];

    return (
        <TextPageLayout title="Sitemap">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 not-prose">
                {sections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                        <ul className="space-y-2">
                            {section.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </TextPageLayout>
    );
}
