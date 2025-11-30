import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | AI Global News",
    description: "Get in touch with our team.",
};

export default function ContactUsPage() {
    return (
        <TextPageLayout
            title="Contact Us"
            subtitle="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        >
            <div className="grid lg:grid-cols-2 gap-12 not-prose">
                <div>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium text-white">First name</label>
                                <Input id="first-name" placeholder="John" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium text-white">Last name</label>
                                <Input id="last-name" placeholder="Doe" className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                            <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-white">Message</label>
                            <Textarea id="message" placeholder="How can we help you?" className="bg-white/5 border-white/10 min-h-[150px]" />
                        </div>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90">Send Message</Button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Email Us</h3>
                            <p className="text-sm text-muted-foreground mb-1">Our friendly team is here to help.</p>
                            <a href="mailto:support@aiglobalnews.com" className="text-primary hover:underline">support@aiglobalnews.com</a>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Office</h3>
                            <p className="text-sm text-muted-foreground mb-1">Come say hello at our office headquarters.</p>
                            <p className="text-white">100 Smith Street<br />Collingwood VIC 3066 AU</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Phone</h3>
                            <p className="text-sm text-muted-foreground mb-1">Mon-Fri from 8am to 5pm.</p>
                            <a href="tel:+15550000000" className="text-primary hover:underline">+1 (555) 000-0000</a>
                        </div>
                    </div>
                </div>
            </div>
        </TextPageLayout>
    );
}
