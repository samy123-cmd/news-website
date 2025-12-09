import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkArticle(id: string) {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return;
    }

    console.log('Article found:', data.title);
    console.log('Content length:', data.content?.length);
    console.log('Summary length:', data.summary?.length);
    console.log('Image URL:', data.image_url);
}

const id = process.argv[2];
if (id) {
    checkArticle(id);
} else {
    console.log("Please provide an ID");
}
