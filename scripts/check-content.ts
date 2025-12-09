import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkArticles() {
    const { data, error } = await supabase
        .from('articles')
        .select('id, title, content, summary')
        .order('published_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    console.log('Latest Articles Content Check:');
    console.log('='.repeat(50));

    data.forEach((article, i) => {
        console.log(`\n--- Article ${i + 1} ---`);
        console.log(`Title: ${article.title?.substring(0, 60)}...`);
        console.log(`Content length: ${article.content?.length || 0} chars`);
        console.log(`Summary length: ${article.summary?.length || 0} chars`);
        console.log(`Content preview: ${article.content?.substring(0, 150) || 'NULL'}`);
    });
}

checkArticles();
