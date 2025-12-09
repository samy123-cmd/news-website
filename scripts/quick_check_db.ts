
import { createClient } from './src/lib/supabase/server';

async function check() {
    const supabase = await createClient();
    const { count, error } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    console.log('Article count:', count);
    if (error) console.error(error);

    const { data } = await supabase.from('articles').select('title, published_at').limit(5);
    console.log('Sample:', data);
}

check();
