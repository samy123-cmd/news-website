
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", url);
console.log("Key set:", !!key, key ? key.substring(0, 10) + '...' : 'NONE');

if (!url || !key) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function test() {
    console.log("Testing connection...");
    const { data, error } = await supabase.from('articles').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Connection OK. Count:", data); // valid, even if null data
    }
}

test();
