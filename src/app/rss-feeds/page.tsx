import { TextPageLayout } from "@/components/TextPageLayout";
import { Metadata } from "next";
import { RssFeedList } from "@/components/RssFeedList";

export const metadata: Metadata = {
    title: "RSS Feeds | AI Global News",
    description: "Subscribe to our content feeds.",
};

export default function RssFeedsPage() {


    return (
        <TextPageLayout
            title="RSS Feeds"
            subtitle="Stay updated with your favorite RSS reader."
        >
            <p>
                We provide standard RSS 2.0 feeds for all our major categories. You can add these URLs to any RSS reader like Feedly, Reeder, or NewsBlur.
            </p>

            <RssFeedList />
        </TextPageLayout>
    );
}
