
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // We need service role for admin access usually, or anon if public

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count, error } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    console.log('Article count:', count);
    if (error) console.error(error);

    const { data } = await supabase.from('articles').select('title, published_at').order('published_at', { ascending: false }).limit(5);
    console.log('Latest 5:', data);
}

check();
