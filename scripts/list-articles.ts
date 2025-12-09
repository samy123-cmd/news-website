import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listArticles() {
    const { data, error } = await supabase
        .from('articles')
        .select('id, title, category')
        .order('published_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    console.log('Latest Articles:');
    data.forEach(article => {
        console.log(`${article.id} | ${article.category} | ${article.title}`);
    });
}

listArticles();
