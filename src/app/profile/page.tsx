
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { User, LogOut, Settings } from "lucide-react";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">
                                Free Plan
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-muted/30 rounded-xl border border-border">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Account Settings
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage your subscription and preferences.
                            </p>
                            <Button variant="outline" disabled>Manage Subscription (Coming Soon)</Button>
                        </div>

                        <form action="/auth/signout" method="post">
                            <Button variant="destructive" className="w-full">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
