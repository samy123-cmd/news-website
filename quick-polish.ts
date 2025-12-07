/**
 * Quick Polish Script - No Scraping Required
 * 
 * This script expands short articles using AI based on the title and existing summary.
 * Run with: npx tsx quick-polish.ts
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load .env.local explicitly
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Missing GEMINI_API_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface ExpandedContent {
    content: string;
    summary: string;
    category: string;
    subcategory: string;
}

async function expandContent(title: string, shortContent: string, retries = 3): Promise<ExpandedContent> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are a senior news editor. Based on the following news headline and snippet, write a FULL news article.

**Headline**: "${title}"
**Snippet**: "${shortContent}"

IMPORTANT: Use your knowledge to expand this into a comprehensive, well-researched article. 
Do NOT just repeat the snippet - elaborate with context, background, and analysis.

Requirements:
1. Write 400-600 words of article content
2. Use HTML formatting: <h3> for subheadings, <p> for paragraphs
3. Include relevant context and background
4. Maintain a neutral, professional journalistic tone
5. Create a bullet-point summary (max 150 words)
6. Assign a category from: [World, Politics, Business, Technology, Sports, Entertainment, Science, Opinion, India, Health]
7. Assign a relevant subcategory

Output JSON ONLY:
{
  "content": "<p>Full article with HTML formatting...</p>",
  "summary": "• Key point 1\\n• Key point 2...",
  "category": "...",
  "subcategory": "..."
}
`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("AI timeout")), 45000)
            );

            const result = await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]) as any;

            const response = await result.response;
            let jsonString = response.text();

            // Extract JSON
            const firstOpen = jsonString.indexOf('{');
            const lastClose = jsonString.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                jsonString = jsonString.substring(firstOpen, lastClose + 1);
            }

            return JSON.parse(jsonString);
        } catch (error: any) {
            const isRateLimit = error.message?.includes('429') ||
                error.message?.includes('retry') ||
                error.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < retries) {
                const waitTime = 30 * attempt; // 30s, 60s, 90s
                console.log(`   ⏳ Rate limited, waiting ${waitTime}s (attempt ${attempt}/${retries})...`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                continue;
            }

            if (attempt === retries) {
                console.error(`   ❌ Failed after ${retries} attempts`);
                throw error;
            }
        }
    }

    throw new Error('Max retries exceeded');
}

async function main() {
    console.log('🔍 Finding articles with short content...\n');

    // Find articles where content is too short
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, content, summary, url')
        .order('published_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('❌ Error fetching articles:', error);
        process.exit(1);
    }

    const shortArticles = articles?.filter(a =>
        (!a.content || a.content.length < 500) && a.title
    ) || [];

    console.log(`Found ${shortArticles.length} articles needing expansion\n`);

    if (shortArticles.length === 0) {
        console.log('✅ All articles already have sufficient content!');
        process.exit(0);
    }

    let polished = 0;
    let failed = 0;

    for (const article of shortArticles) {
        const titlePreview = article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title;
        console.log(`📝 Expanding: ${titlePreview}`);

        try {
            const shortContent = article.content || article.summary || '';
            const expanded = await expandContent(article.title, shortContent);

            // Update database
            const { error: updateError } = await supabase
                .from('articles')
                .update({
                    content: expanded.content,
                    summary: expanded.summary,
                    category: expanded.category,
                    subcategory: expanded.subcategory,
                })
                .eq('id', article.id);

            if (updateError) {
                console.log('   ❌ DB update failed:', updateError.message);
                failed++;
            } else {
                console.log(`   ✅ Expanded (${expanded.content.length} chars)`);
                polished++;
            }

            // Rate limit to avoid API limits (5 seconds between articles)
            await new Promise(resolve => setTimeout(resolve, 5000));

        } catch (error: any) {
            console.log(`   ❌ Failed: ${error.message || error}`);
            failed++;
        }
    }

    console.log(`\n✨ Done! Expanded: ${polished}, Failed: ${failed}`);
}

main();
