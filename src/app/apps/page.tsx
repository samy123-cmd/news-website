import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Smartphone, Download, Bell } from "lucide-react";

export default function AppsPage() {
    return (
        <div className="min-h-screen bg-[#0b1624] text-foreground flex flex-col items-center justify-center relative overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80')] bg-cover bg-center opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] via-[#0b1624]/80 to-transparent" />

            <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-8 ring-1 ring-primary/20 shadow-lg shadow-primary/10">
                    <Smartphone className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
                    Experience News <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        On The Go
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                    Our native iOS and Android apps are currently in final beta testing.
                    Get ready for a smoother, faster, and more personalized reading experience.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-lg mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 group hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white mb-1">iOS App</h3>
                            <p className="text-xs text-muted-foreground">Coming to App Store</p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 group hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Download className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white mb-1">Android App</h3>
                            <p className="text-xs text-muted-foreground">Coming to Play Store</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-4 text-primary font-bold text-sm uppercase tracking-wider">
                        <Bell className="w-4 h-4" /> Notify Me
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Get notified when we launch</h3>
                    <p className="text-sm text-muted-foreground mb-6">Be the first to download and get 1 month of Premium for free.</p>

                    <form className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary"
                        />
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                            Join List
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
