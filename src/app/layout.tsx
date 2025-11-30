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
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://global-ai-news.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Global AI News | Premium Aggregator",
    template: "%s | Global AI News",
  },
  description: "Experience the future of news. Real-time, AI-curated journalism from verified global sources. Unbiased, comprehensive, and premium.",
  keywords: ["AI News", "Global News", "Tech News", "World News", "Artificial Intelligence", "Journalism", "Verified News", "Premium News"],
  authors: [{ name: "Global AI News Team" }],
  openGraph: {
    title: "Global AI News | The Future of Journalism",
    description: "Real-time, AI-curated journalism from verified global sources. Unbiased, comprehensive, and premium.",
    url: BASE_URL,
    siteName: "Global AI News",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global AI News Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global AI News",
    description: "Real-time, AI-curated journalism from verified global sources.",
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
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': '/?lang=en',
      'hi-IN': '/?lang=hi',
    },
  },
};

// Force rebuild
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${notoSansDevanagari.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        <JsonLd />
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <TopBar />
                <Suspense fallback={<div className="h-20 bg-background/80 backdrop-blur-md border-b border-white/10" />}>
                  <Header />
                </Suspense>
                <main className="flex-grow">
                  {children}
                  <Analytics />
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
