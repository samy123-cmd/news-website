import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-invert prose-lg max-w-none">
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Global AI News ("we", "our", or "us") is committed to protecting your privacy.
                    This Privacy Policy explains how your personal information is collected, used, and disclosed by Global AI News.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you subscribe to our newsletter,
                    create an account, or contact us for support.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use the information we collect to provide, maintain, and improve our services,
                    to develop new ones, and to protect Global AI News and our users.
                </p>

                <h2>3. Cookies and Tracking Technologies</h2>
                <p>
                    We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
                </p>

                <h2>4. Third-Party Services</h2>
                <p>
                    We may employ third-party companies and individuals due to the following reasons:
                    <ul>
                        <li>To facilitate our Service;</li>
                        <li>To provide the Service on our behalf;</li>
                        <li>To perform Service-related services; or</li>
                        <li>To assist us in analyzing how our Service is used.</li>
                    </ul>
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: privacy@global-ai-news.com
                </p>
            </div>
        </div>
    );
}
