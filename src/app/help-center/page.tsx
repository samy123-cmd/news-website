import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "Help Center | AI Global News",
    description: "Frequently asked questions and support.",
};

export default function HelpCenterPage() {
    return (
        <TextPageLayout
            title="Help Center"
            subtitle="Find answers to common questions about AI Global News."
        >
            <div className="not-prose">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the AI curation work?</AccordionTrigger>
                        <AccordionContent>
                            Our proprietary AI algorithms scan thousands of verified news sources in real-time. They analyze content for factual accuracy, bias, and sentiment, then synthesize the information into concise, objective summaries.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is the news unbiased?</AccordionTrigger>
                        <AccordionContent>
                            We strive for neutrality. Our AI is trained to detect and flag emotionally charged language. We also provide "Source Transparency" badges so you can see where the information comes from.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>How can I customize my feed?</AccordionTrigger>
                        <AccordionContent>
                            You can customize your feed by selecting your preferred categories and regions in the settings menu. We are also working on more advanced personalization features.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
                        <AccordionContent>
                            Yes! Our mobile apps for iOS and Android are currently in beta and will be launching soon. You can sign up for the waitlist on our Apps page.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20 not-prose">
                <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-4">Our support team is available 24/7 to assist you.</p>
                <a href="/contact-us" className="text-primary font-bold hover:underline">Contact Support &rarr;</a>
            </div>
        </TextPageLayout>
    );
}
