import { track } from '@vercel/analytics';

type EventName =
    | 'article_click'
    | 'hero_click'
    | 'newsletter_subscribe'
    | 'ad_impression'
    | 'share_click'
    | 'bookmark_click';

interface EventProperties {
    [key: string]: string | number | boolean;
}

export const analytics = {
    track: (name: EventName, properties?: EventProperties) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${name}`, properties);
        }

        // Track with Vercel Analytics
        track(name, properties);
    }
};
