/**
 * Bulk Polish Script
 * 
 * Run with: npx tsx polish-articles.ts
 * 
 * This script finds articles with short content and polishes them using AI.
 */

import { createClient } from '@supabase/supabase-js';
import { polishContent } from './src/lib/ai/polisher';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';

// Load .env.local explicitly
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY - polishing will not work');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapeContent(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobalAINews/1.0;)' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) return '';

        const html = await response.text();

        try {
            const { document } = parseHTML(html);
            const reader = new Readability(document);
            const article = reader.parse();
            return article?.textContent || '';
        } catch (parseError) {
            console.warn(`Failed to parse ${url}:`, parseError);
            return '';
        }
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn(`   ⏱️  Timeout scraping ${url}`);
        } else {
            console.warn(`   ❌ Scrape error:`, error.message || error);
        }
        return '';
    }
}

async function main() {
    console.log('🔍 Finding articles with short content...\n');

    // Find articles where content is too short
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, url, content')
        .order('published_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching articles:', error);
        process.exit(1);
    }

    const shortArticles = articles?.filter(a =>
        !a.content || a.content.length < 500
    ) || [];

    console.log(`Found ${shortArticles.length} articles needing polish\n`);

    let polished = 0;
    let failed = 0;

    for (const article of shortArticles) {
        console.log(`📝 Polishing: ${article.title.substring(0, 50)}...`);

        try {
            // Scrape full content
            const rawText = await scrapeContent(article.url);

            if (rawText.length < 200) {
                console.log('   ⚠️  Skipped - could not scrape content');
                failed++;
                continue;
            }

            // Polish with AI (with timeout)
            const polishPromise = polishContent(rawText, article.title);
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('AI polish timeout')), 20000)
            );

            const polishedContent = await Promise.race([polishPromise, timeoutPromise]);

            // Update database
            const { error: updateError } = await supabase
                .from('articles')
                .update({
                    content: polishedContent.content,
                    summary: polishedContent.summary,
                    category: polishedContent.category,
                    subcategory: polishedContent.subcategory,
                })
                .eq('id', article.id);

            if (updateError) {
                console.log('   ❌ DB update failed:', updateError.message);
                failed++;
            } else {
                console.log('   ✅ Polished successfully');
                polished++;
            }

            // Rate limit to avoid hitting API limits
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.log('   ❌ Error:', error);
            failed++;
        }
    }

    console.log(`\n✨ Done! Polished: ${polished}, Failed: ${failed}`);
}

main();
