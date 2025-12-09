import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    console.log(JSON.stringify({ error: "Missing credentials" }));
    process.exit(1);
}

async function run() {
    const adminClient = createClient(supabaseUrl!, serviceRoleKey!);
    const { count: adminCount, error: adminError } = await adminClient
        .from('articles')
        .select('*', { count: 'exact', head: true });

    const anonClient = createClient(supabaseUrl!, anonKey!);
    const { count: anonCount, error: anonError } = await anonClient
        .from('articles')
        .select('*', { count: 'exact', head: true });

    const { data: categories, error: catError } = await adminClient
        .from('articles')
        .select('category');

    const categoryCounts: Record<string, number> = {};
    categories?.forEach(c => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const result = {
        total: adminCount,
        categories: categoryCounts,
        rlsBlocking: (adminCount || 0) > 0 && (anonCount || 0) === 0
    };

    const fs = await import('fs');
    fs.writeFileSync('db-verify-result.json', JSON.stringify(result, null, 2));
    console.log("Done writing to db-verify-result.json");

    // Try to insert a dummy article to test write access
    console.log("Attempting write test...");
    const { error: writeError } = await adminClient.from('articles').upsert({
        title: "Write Test " + Date.now(),
        url: "https://test.com/write-" + Date.now(),
        summary: "Testing write access.",
        category: "Science", // Try to populate Science
        subcategory: "Test",
        source: "Verify Script",
        published_at: new Date().toISOString()
    }, { onConflict: 'url' });

    if (writeError) {
        console.error("Write Test Failed:", writeError);
    } else {
        console.log("Write Test Succeeded!");
    }
}

run();
