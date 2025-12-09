import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false
    }
});

async function run() {
    console.log("Testing Upsert...");
    const { data, error } = await supabase.from('articles').upsert({
        title: "Test Article " + Date.now(),
        url: "https://example.com/test-" + Date.now(),
        summary: "This is a test article.",
        content: "Test content.",
        source: "Test Script",
        category: "Opinion",
        subcategory: "Opinion",
        published_at: new Date().toISOString()
    }, { onConflict: 'url' });

    if (error) {
        console.error("Upsert Error:", error);
    } else {
        console.log("Upsert Successful!");
    }
}

run();
