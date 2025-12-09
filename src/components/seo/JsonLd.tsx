
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ainews-olive.vercel.app";

export default function JsonLd() {
    // Organization schema
    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Global AI News",
        "url": BASE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`,
            "width": 512,
            "height": 512
        },
        "description": "Real-time, AI-curated journalism from verified global sources.",
        "sameAs": [
            "https://twitter.com/globalainews",
            "https://facebook.com/globalainews"
        ],
        "founder": {
            "@type": "Organization",
            "name": "Global AI News Team"
        }
    };

    // WebSite schema with search action (for Google Sitelinks Search Box)
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "name": "Global AI News",
        "url": BASE_URL,
        "description": "Real-time AI-curated news from verified global sources",
        "publisher": {
            "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
        </>
    );
}

