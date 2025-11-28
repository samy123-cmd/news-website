
interface ArticleJsonLdProps {
    article: {
        id: string;
        title: string;
        summary?: string;
        content?: string;
        image_url?: string;
        published_at: string;
        updated_at?: string;
        author?: string;
        source?: string;
        url?: string;
    };
}

export default function ArticleJsonLd({ article }: ArticleJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.summary,
        "image": article.image_url ? [article.image_url] : [],
        "datePublished": article.published_at,
        "dateModified": article.updated_at || article.published_at,
        "author": [{
            "@type": "Organization",
            "name": article.source || "Global AI News",
            "url": article.url
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Global AI News",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://global-ai-news.com"}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://global-ai-news.com"}/article/${article.id}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
