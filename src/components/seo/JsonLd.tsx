
export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "name": "Global AI News",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://ainews-olive.vercel.app",
        "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://ainews-olive.vercel.app"}/logo.png`,
        "sameAs": [
            "https://twitter.com/globalainews",
            "https://facebook.com/globalainews"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
