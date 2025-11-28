
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "./client";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch all articles, ordered by newest first
    const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching articles:", error);
        return <div className="p-8 text-red-500">Error loading dashboard. Please try again.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Editorial Dashboard</h1>
                    <p className="text-muted-foreground">Review and approve AI-generated content.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Settings</button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">New Article</button>
                </div>
            </header>

            <AdminDashboardClient initialArticles={articles || []} />
        </div>
    );
}

