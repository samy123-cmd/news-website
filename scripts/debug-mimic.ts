
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("URL:", url);
console.log("Key:", key ? key.substring(0, 5) : 'NONE');

// Mimic ingest.ts initialization exactly
const supabase = createClient(url, key, {
    auth: { persistSession: false }
});

async function test() {
    console.log("Testing .in() query...");
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('url')
            .in('url', ['https://example.com/notfound']);

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Supabase Success. Rows:", data?.length);
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

test();
