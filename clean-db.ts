
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
    },
});

async function cleanDb() {
    console.log('Listing articles to verify...');

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, published_at')
        .ilike('title', 'Write Test%')
        .order('published_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching articles:', error);
    } else {
        console.log('Found articles:', data);
    }
}

cleanDb();
