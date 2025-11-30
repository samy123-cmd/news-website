import { ReactNode } from "react";

interface TextPageLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function TextPageLayout({ title, subtitle, children }: TextPageLayoutProps) {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12 border-b border-white/5 pb-8">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
