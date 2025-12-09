"use client";

import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";

export function JoinConversation() {
    return (
        <div className="mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
            <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Join the Conversation</h3>
            <p className="text-muted-foreground mb-6">Subscribe to our newsletter for daily updates.</p>
            <Button
                className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })}
            >
                Subscribe
            </Button>
        </div>
    );
}
