import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
    const { data: articles } = await supabase
        .from('articles')
        .select('title, url, source, created_at')
        .eq('category', 'General')
        .limit(10);

    console.log("--- General Articles Sample ---");
    articles?.forEach(a => console.log(`[${a.source}] ${a.title} (${a.url})`));
}

run();
