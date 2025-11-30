import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Accessibility | AI Global News",
    description: "Our commitment to digital accessibility.",
};

export default function AccessibilityPage() {
    return (
        <TextPageLayout
            title="Accessibility Statement"
            subtitle="We are committed to ensuring digital accessibility for people with disabilities."
        >
            <p>
                AI Global News is dedicated to ensuring our website and mobile applications are accessible to the widest possible audience, regardless of technology or ability. We are actively working to increase the accessibility and usability of our website and in doing so adhere to many of the available standards and guidelines.
            </p>

            <h2>Conformance Status</h2>
            <p>
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. AI Global News is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
            </p>

            <h2>Feedback</h2>
            <p>
                We welcome your feedback on the accessibility of AI Global News. Please let us know if you encounter accessibility barriers on AI Global News:
            </p>
            <ul>
                <li>E-mail: <a href="mailto:accessibility@aiglobalnews.com">accessibility@aiglobalnews.com</a></li>
                <li>Postal address: 100 Smith Street, Collingwood VIC 3066 AU</li>
            </ul>
            <p>
                We try to respond to feedback within 2 business days.
            </p>
        </TextPageLayout>
    );
}
