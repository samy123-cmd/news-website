import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-invert prose-lg max-w-none">
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Global AI News ("we", "our", or "us") operates the website https://www.globalainews.in/ (the "Service").
                    This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>

                <h2>1. Information Collection and Use</h2>
                <p>
                    We collect several different types of information for various purposes to provide and improve our Service to you.
                </p>

                <h3>Personal Data</h3>
                <p>
                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data").
                    Personally identifiable information may include, but is not limited to:
                </p>
                <ul>
                    <li>Cookies and Usage Data</li>
                    <li>Email address (if you subscribe to our newsletter)</li>
                </ul>

                <h2>2. Advertising and Cookies</h2>
                <p>
                    We rely on third-party advertising to fund our operations. We work with partners like Google AdSense to serve ads on our website.
                </p>

                <h3>Google AdSense & DoubleClick Cookie</h3>
                <p>
                    Google, as a third-party vendor, uses cookies to serve ads on our Service. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our Service or other websites on the Internet.
                </p>
                <p>
                    You may opt out of the use of the DoubleClick Cookie for interest-based advertising by visiting the <a href="http://www.google.com/ads/preferences/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> page.
                </p>

                <h3>GDPR and Consent</h3>
                <p>
                    For users in the European Economic Area (EEA), we implement a Consent Management Platform (CMP) to collect your consent for the use of cookies and personal data for personalized advertising.
                    You can withdraw your consent at any time using the link in the footer of our website.
                </p>

                <h2>3. Analytics</h2>
                <p>
                    We may use third-party Service Providers to monitor and analyze the use of our Service.
                </p>
                <p><strong>Google Analytics</strong></p>
                <p>
                    Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.
                </p>

                <h2>4. Data Security</h2>
                <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us via email at: <strong>legal@globalainews.in</strong>
                </p>
            </div>
        </div>
    );
}
