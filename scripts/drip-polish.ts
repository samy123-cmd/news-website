/**
 * Drip Polish Script - For Free API Tier
 * 
 * Processes 1 article every 5 minutes to stay under Gemini rate limits.
 * Run with: npx tsx drip-polish.ts
 * 
 * Leave it running in the background - it will polish all articles slowly.
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey || !process.env.GEMINI_API_KEY) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DELAY_BETWEEN_ARTICLES = 5 * 60 * 1000; // 5 minutes in ms

async function expandContent(title: string, shortContent: string): Promise<any> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Using 2.0-flash
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are a senior news editor. Expand this news into a full article.

**Headline**: "${title}"
**Snippet**: "${shortContent}"

Write a comprehensive 400-600 word article with context and analysis.
Use HTML: <h3> for subheadings, <p> for paragraphs.

Output JSON:
{
  "content": "<p>Full article...</p>",
  "summary": "• Key point 1\\n• Key point 2...",
  "category": "World|Politics|Business|Technology|Sports|Entertainment|Science|Opinion|India|Health",
  "subcategory": "..."
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text();

    const firstOpen = jsonString.indexOf('{');
    const lastClose = jsonString.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
        jsonString = jsonString.substring(firstOpen, lastClose + 1);
    }

    return JSON.parse(jsonString);
}

async function getNextArticle() {
    // Fetch more articles and filter by length in JS 
    // (Supabase can't filter by string length directly)
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, content, summary')
        .order('published_at', { ascending: false })
        .limit(50);

    // Find first article with short or missing content
    const shortArticle = articles?.find(a =>
        !a.content || a.content.length < 500
    );

    return shortArticle || null;
}

async function processOneArticle() {
    const article = await getNextArticle();

    if (!article) {
        console.log('✅ All articles are polished! Exiting.');
        process.exit(0);
    }

    const titlePreview = article.title.substring(0, 50);
    console.log(`\n📝 [${new Date().toLocaleTimeString()}] Processing: ${titlePreview}...`);

    try {
        const shortContent = article.content || article.summary || '';
        const expanded = await expandContent(article.title, shortContent);

        const { error } = await supabase
            .from('articles')
            .update({
                content: expanded.content,
                summary: expanded.summary,
                category: expanded.category,
                subcategory: expanded.subcategory,
            })
            .eq('id', article.id);

        if (error) {
            console.log(`   ❌ DB error: ${error.message}`);
        } else {
            console.log(`   ✅ Done! (${expanded.content.length} chars)`);
        }
    } catch (error: any) {
        console.log(`   ❌ AI Error: ${error.message}`);
        // If rate limited, wait extra time
        if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
            console.log('   ⏳ Rate limited - waiting 2 extra minutes...');
            await new Promise(r => setTimeout(r, 2 * 60 * 1000));
        }
    }
}

async function main() {
    console.log('🚀 Drip Polish Started');
    console.log('   Processing 1 article every 5 minutes to stay under rate limits.\n');
    console.log('   Leave this running in the background. Press Ctrl+C to stop.\n');

    // Check how many need processing
    const { data: articles } = await supabase
        .from('articles')
        .select('id, content')
        .order('published_at', { ascending: false })
        .limit(50);

    const needsPolish = articles?.filter(a => !a.content || a.content.length < 500).length || 0;
    console.log(`📊 ${needsPolish} articles need polishing. ETA: ~${needsPolish * 5} minutes\n`);

    // Process first one immediately
    await processOneArticle();

    // Then set up interval for the rest
    setInterval(async () => {
        await processOneArticle();
    }, DELAY_BETWEEN_ARTICLES);
}

main();
