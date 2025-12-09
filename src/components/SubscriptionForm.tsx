"use client";

import { useActionState } from "react"; // New hook for form actions in React 19/Next 15
import { Button } from "@/components/ui/Button";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/subscribe";
import { useEffect, useState } from "react";
// import { useToast } from "@/components/ui/use-toast"; // Assuming you have a toast component

export function SubscriptionForm() {
    const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);
    // const { toast } = useToast();
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (state?.success) {
            setEmail(""); // Clear input on success
            // toast({ title: "Success", description: state.message });
        } else if (state?.success === false) {
            // toast({ title: "Error", description: state.message, variant: "destructive" });
        }
    }, [state]);

    return (
        <form action={formAction} className="flex flex-col gap-2">
            <div className="flex gap-2">
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50"
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 text-white font-bold disabled:opacity-70"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Mail className="w-4 h-4 mr-2" />
                    )}
                    {isPending ? "Joining..." : "Get Brief"}
                </Button>
            </div>
            {state?.message && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${state.success ? "text-green-400" : "text-red-400"}`}>
                    {state.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {state.message}
                </p>
            )}
        </form>
    );
}
