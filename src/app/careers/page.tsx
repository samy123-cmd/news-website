import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Careers | AI Global News",
    description: "Join our team and help shape the future of news.",
};

export default function CareersPage() {
    return (
        <TextPageLayout
            title="Careers"
            subtitle="Join us in our mission to revolutionize how the world consumes information."
        >
            <h2>Why Join Us?</h2>
            <p>
                At AI Global News, we are at the intersection of journalism and artificial intelligence. We are building the future of news aggregation, ensuring that information is accessible, unbiased, and verified.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-12 not-prose">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Innovation First</h3>
                    <p className="text-muted-foreground text-sm">Work with cutting-edge LLMs and real-time data pipelines.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Global Impact</h3>
                    <p className="text-muted-foreground text-sm">Your work will reach millions of readers worldwide.</p>
                </div>
            </div>

            <h2>Open Positions</h2>
            <div className="space-y-4 not-prose">
                {["Senior Full Stack Engineer", "AI Research Scientist", "Product Designer", "Editorial Lead"].map((job) => (
                    <div key={job} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary/50 transition-colors group">
                        <div>
                            <h4 className="font-bold text-white">{job}</h4>
                            <p className="text-xs text-muted-foreground">Remote • Full Time</p>
                        </div>
                        <Button variant="ghost" size="sm" className="group-hover:text-primary">
                            Apply <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                ))}
            </div>
        </TextPageLayout>
    );
}
