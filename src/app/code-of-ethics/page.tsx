
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Code of Ethics | AI Global News",
    description: "Our commitment to unbiased journalism.",
};

export default function EthicsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Code of Ethics</h1>

            <div className="prose prose-invert max-w-none">
                <p className="text-xl text-muted-foreground mb-8">
                    Trust is the currency of journalism. We are committed to the highest standards of integrity, accuracy, and fairness.
                </p>

                <h2>1. Accuracy</h2>
                <p>
                    We strive to ensure that all information we publish is accurate and verified. Our AI models are tuned to prioritize factual reporting over sensationalism.
                </p>

                <h2>2. Independence</h2>
                <p>
                    We maintain complete editorial independence. Our coverage is not influenced by advertisers, investors, or political interests.
                </p>

                <h2>3. Transparency</h2>
                <p>
                    We are transparent about our use of AI. All AI-generated content is clearly labeled, and we disclose our sources.
                </p>

                <h2>4. Accountability</h2>
                <p>
                    We take responsibility for our work. If we make a mistake, we will correct it promptly and transparently.
                </p>
            </div>
        </div>
    );
}
