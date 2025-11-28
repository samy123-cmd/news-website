"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, X, Edit2, Eye } from "lucide-react";

// Mock Drafts
const MOCK_DRAFTS = [
    {
        id: "d-1",
        title: "AI Breakthrough in Climate Modeling",
        summary: "Scientists have developed a new AI model that predicts weather patterns with 99% accuracy...",
        status: "draft",
        author: "Gemini AI",
        date: "2025-11-28T10:00:00Z"
    },
    {
        id: "d-2",
        title: "Global Markets Rally on Tech Earnings",
        summary: "Major tech stocks surged today as earnings reports exceeded expectations...",
        status: "draft",
        author: "Gemini AI",
        date: "2025-11-28T09:30:00Z"
    }
];

export default function AdminDashboard() {
    const [drafts, setDrafts] = useState(MOCK_DRAFTS);

    const handleApprove = (id: string) => {
        setDrafts(drafts.filter(d => d.id !== id));
        // In real app: Call API to update status to 'published'
        alert(`Draft ${id} approved and published!`);
    };

    const handleReject = (id: string) => {
        setDrafts(drafts.filter(d => d.id !== id));
        // In real app: Call API to delete or mark as rejected
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Editorial Dashboard</h1>
                    <p className="text-muted-foreground">Review and approve AI-generated content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Settings</Button>
                    <Button>New Article</Button>
                </div>
            </header>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h2 className="font-bold">Pending Drafts ({drafts.length})</h2>
                </div>

                {drafts.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        No pending drafts. Good job! 🎉
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {drafts.map((draft) => (
                            <div key={draft.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-grow space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            {draft.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{new Date(draft.date).toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">• by {draft.author}</span>
                                    </div>
                                    <h3 className="text-lg font-bold">{draft.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{draft.summary}</p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button variant="ghost" size="icon" title="Preview">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <div className="w-px h-6 bg-border mx-1" />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                                        onClick={() => handleReject(draft.id)}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleApprove(draft.id)}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
