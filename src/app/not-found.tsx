import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                <FileQuestion className="w-12 h-12 text-muted-foreground" />
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                    Page Not Found
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    The story you're looking for seems to have expired or moved.
                    Our AI is constantly updating, so it might be old news.
                </p>
            </div>

            <div className="flex gap-4">
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8">
                        Back to Headlines
                    </Button>
                </Link>
            </div>
        </div>
    );
}
