import * as cheerio from 'cheerio';

export interface Trend {
    name: string;
    url: string;
    tweet_count?: string;
}

export async function scrapeTrends(scope: 'global' | 'local'): Promise<Trend[]> {
    const url = scope === 'global'
        ? 'https://trends24.in/'
        : 'https://trends24.in/india/';

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch trends: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const trends: Trend[] = [];

        // Select the first list (latest hour)
        // The structure is typically: .trend-card .trend-card__list li
        const listItems = $('.trend-card__list').first().find('li');

        listItems.each((_, element) => {
            const link = $(element).find('a');
            const count = $(element).find('.trend-card__list-count');

            if (link.length) {
                trends.push({
                    name: link.text().trim(),
                    url: link.attr('href') || '#',
                    tweet_count: count.text().trim() || undefined
                });
            }
        });

        return trends.slice(0, 10); // Return top 10
    } catch (error) {
        console.error('Error scraping trends:', error);
        return [];
    }
}
