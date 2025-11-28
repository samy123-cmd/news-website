
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | AI Global News",
    description: "How we protect your data.",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last Updated: November 28, 2025</p>

            <div className="prose prose-invert max-w-none">
                <p>
                    At AI Global News, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact support. This may include your name, email address, and payment information.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use your information to:
                </p>
                <ul>
                    <li>Provide and improve our services.</li>
                    <li>Personalize your news feed.</li>
                    <li>Send you newsletters and updates.</li>
                    <li>Detect and prevent fraud.</li>
                </ul>

                <h2>3. Data Security</h2>
                <p>
                    We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2>4. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at privacy@aiglobalnews.com.
                </p>
            </div>
        </div>
    );
}
