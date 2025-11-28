
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | AI Global News",
    description: "Rules for using our platform.",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last Updated: November 28, 2025</p>

            <div className="prose prose-invert max-w-none">
                <p>
                    Welcome to AI Global News. By accessing or using our website, you agree to be bound by these Terms of Service.
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing our services, you agree to these terms. If you do not agree, you may not use our services.
                </p>

                <h2>2. Use of Content</h2>
                <p>
                    All content on this site is for informational purposes only. You may not reproduce, distribute, or sell any content without our prior written permission.
                </p>

                <h2>3. User Accounts</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                </p>

                <h2>4. Limitation of Liability</h2>
                <p>
                    AI Global News is not liable for any indirect, incidental, or consequential damages arising from your use of our services.
                </p>
            </div>
        </div>
    );
}
