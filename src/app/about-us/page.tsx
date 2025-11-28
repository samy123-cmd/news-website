
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | AI Global News",
    description: "Learn about our mission to revolutionize news with AI.",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">About AI Global News</h1>

            <div className="prose prose-invert max-w-none">
                <p className="text-xl text-muted-foreground mb-8">
                    We are the world&apos;s first premium AI-powered news aggregator, dedicated to delivering unbiased, real-time, and polished journalism from across the globe.
                </p>

                <h2>Our Mission</h2>
                <p>
                    In an era of information overload, our mission is to cut through the noise. We leverage advanced Artificial Intelligence to curate, summarize, and verify news from thousands of trusted sources, presenting it to you in a clean, ad-free environment.
                </p>

                <h2>How It Works</h2>
                <p>
                    Our proprietary AI algorithms scan the web 24/7 for breaking news. Each story undergoes a rigorous multi-step process:
                </p>
                <ul>
                    <li><strong>Ingestion:</strong> We monitor RSS feeds from top-tier global publishers.</li>
                    <li><strong>Analysis:</strong> Our AI analyzes the content for facts, sentiment, and bias.</li>
                    <li><strong>Polishing:</strong> We rewrite headlines and summaries to be concise and objective.</li>
                    <li><strong>Verification:</strong> Human editors review high-impact stories to ensure accuracy.</li>
                </ul>

                <h2>Our Team</h2>
                <p>
                    We are a diverse team of journalists, data scientists, and engineers working together to build the future of news consumption.
                </p>
            </div>
        </div>
    );
}
