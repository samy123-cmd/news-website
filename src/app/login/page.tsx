
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        setIsLoading(false);

        if (error) {
            alert(error.message);
        } else {
            setIsSent(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1624] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                            AI
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                            Global News
                        </span>
                    </Link>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to access your personalized news feed.</p>
                </div>

                <div className="bg-[#142235]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {isSent ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Check your email</h3>
                                <p className="text-muted-foreground text-sm">
                                    We&apos;ve sent a magic link to <span className="text-white font-medium">{email}</span>.
                                    <br />Click the link to sign in.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5"
                                onClick={() => setIsSent(false)}
                            >
                                Use a different email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-muted-foreground/50 h-12 focus:border-primary/50 focus:ring-primary/20"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    <>
                                        Sign In with Email <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#142235] px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                                    onClick={async () => {
                                        await supabase.auth.signInWithOAuth({
                                            provider: 'google',
                                            options: {
                                                redirectTo: `${location.origin}/auth/callback`,
                                            },
                                        });
                                    }}
                                >
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                                    onClick={async () => {
                                        await supabase.auth.signInWithOAuth({
                                            provider: 'github',
                                            options: {
                                                redirectTo: `${location.origin}/auth/callback`,
                                            },
                                        });
                                    }}
                                >
                                    GitHub
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    By signing in, you agree to our <Link href="#" className="underline hover:text-white">Terms of Service</Link> and <Link href="#" className="underline hover:text-white">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}
