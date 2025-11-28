import type { Metadata } from "next";
import { Inter, Manrope, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://global-ai-news.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Global AI News | Premium Aggregator",
    template: "%s | Global AI News",
  },
  description: "Real-time AI-curated news from around the world. Unbiased, verified, and premium journalism.",
  keywords: ["AI News", "Global News", "Tech News", "World News", "Artificial Intelligence", "Journalism"],
  authors: [{ name: "Global AI News Team" }],
  openGraph: {
    title: "Global AI News",
    description: "Real-time AI-curated news from around the world.",
    url: BASE_URL,
    siteName: "Global AI News",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // We need to ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "Global AI News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global AI News",
    description: "Real-time AI-curated news from around the world.",
    creator: "@globalainews",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${notoSansDevanagari.variable} font-sans antialiased bg-background text-foreground`}
      >
        <JsonLd />
        <LanguageProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <TopBar />
              <Suspense fallback={<div className="h-20 bg-background/80 backdrop-blur-md border-b border-white/10" />}>
                <Header />
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
