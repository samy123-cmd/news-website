import { STATIC_CONTENT } from "@/lib/content";
import { notFound } from "next/navigation";

interface ContentPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ContentPageProps) {
    const { slug } = await params;
    const data = STATIC_CONTENT[slug];

    if (!data) return { title: "Page Not Found" };

    const title = `${data.title} | Global AI News`;
    const description = `${data.title} - Global AI News`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            locale: "en_US",
            url: `/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function ContentPage({ params }: ContentPageProps) {
    const { slug } = await params;
    const data = STATIC_CONTENT[slug];

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="space-y-8">
                    <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                            {data.title}
                        </h1>
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/80"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                </div>
            </div>
        </div>
    );
}
