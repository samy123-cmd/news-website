'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions";

export function NewsletterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const result = await subscribeToNewsletter(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
        }

        setIsLoading(false);
    }

    if (message?.type === 'success') {
        return (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">{message.text}</span>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 h-12 focus:border-primary/50 focus:ring-primary/20"
                    required
                />
            </div>
            {message?.type === 'error' && (
                <p className="text-red-500 text-xs">{message.text}</p>
            )}
            <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </Button>
        </form>
    );
}
