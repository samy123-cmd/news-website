
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ainews-olive.vercel.app";

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
        category?: string;
    };
}

export default function ArticleJsonLd({ article }: ArticleJsonLdProps) {
    // NewsArticle schema for rich snippets
    const articleLd = {
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
                "url": `${BASE_URL}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/article/${article.id}`
        },
        "keywords": article.category ? `${article.category}, news, AI news, latest news` : "news, AI news",
        "articleSection": article.category || "News",
        "inLanguage": "en-US"
    };

    // BreadcrumbList schema for navigation rich results
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": article.category || "News",
                "item": `${BASE_URL}/?category=${article.category || 'All'}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
                suppressHydrationWarning
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
                suppressHydrationWarning
            />
        </>
    );
}
