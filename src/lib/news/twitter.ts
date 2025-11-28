import { createClient } from '@/lib/supabase/server';
import { polishContent } from '@/lib/ai/polisher';

// Mock Verified Accounts
const VERIFIED_ACCOUNTS = [
    { handle: '@SpaceX', name: 'SpaceX', category: 'Technology', subcategory: 'Space' },
    { handle: '@BCCI', name: 'BCCI', category: 'Sports', subcategory: 'Cricket' },
    { handle: '@WHO', name: 'World Health Organization', category: 'Health', subcategory: 'Global' },
];

// Mock Tweets (In a real app, use Twitter API v2)
const MOCK_TWEETS = [
    {
        handle: '@SpaceX',
        text: "Starship flight 4 complete. Data confirms heat shield performance exceeded expectations. Next launch targeting next month.",
        id: '1234567890',
        created_at: new Date().toISOString()
    },
    {
        handle: '@BCCI',
        text: "Squad announced for the upcoming T20 World Cup. Young talents get the call up as veterans rest.",
        id: '0987654321',
        created_at: new Date().toISOString()
    }
];

export async function ingestTwitter() {
    const supabase = await createClient();
    const results = [];

    for (const tweet of MOCK_TWEETS) {
        const account = VERIFIED_ACCOUNTS.find(a => a.handle === tweet.handle);
        if (!account) continue;

        // Check existence
        const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('url', `https://twitter.com/${tweet.handle}/status/${tweet.id}`)
            .single();

        if (existing) continue;

        // Polish Tweet into a News Snippet
        const polished = await polishContent(tweet.text, `Update from ${account.name}`);

        // Insert
        const { error } = await supabase
            .from('articles')
            .insert({
                title: polished.headline,
                url: `https://twitter.com/${tweet.handle}/status/${tweet.id}`,
                summary: polished.summary,
                source: `X (${account.name})`,
                published_at: tweet.created_at,
                language: 'en',
                category: account.category, // Use predefined category for reliability
                subcategory: account.subcategory,
                image_url: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png' // Placeholder X logo
            });

        if (!error) {
            results.push(polished.headline);
        }
    }

    return results;
}
