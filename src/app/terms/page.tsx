import React from 'react';

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-invert prose-lg max-w-none">
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the
                    Global AI News website (the "Service") operated by Global AI News ("us", "we", or "our").
                </p>

                <h3>1. Conditions of Use</h3>
                <p>
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                    These Terms apply to all visitors, users, and others who access or use the Service.
                </p>

                <h3>2. Content</h3>
                <p>
                    Our Service allows you to post, link, store, share and otherwise make available certain information,
                    text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                    to the Service, including its legality, reliability, and appropriateness.
                </p>

                <h3>3. Links To Other Web Sites</h3>
                <p>
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by Global AI News.
                    Global AI News has no control over, and assumes no responsibility for, the content, privacy policies, or practices
                    of any third-party web sites or services.
                </p>

                <h3>4. Termination</h3>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever,
                    including without limitation if you breach the Terms.
                </p>

                <h3>5. Governing Law</h3>
                <p>
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>

                <h3>6. Changes</h3>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                    If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
                </p>

                <h3>7. Contact Us</h3>
                <p>
                    If you have any questions about these Terms, please contact us at: legal@global-ai-news.com
                </p>
            </div>
        </div>
    );
}
