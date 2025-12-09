import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
    try {
        console.log("Searching for Dave...");
        const { data: articles, error } = await supabase
            .from('articles')
            .select('title, content, summary')
            .or('content.ilike.%Dave%,summary.ilike.%Dave%')
            .limit(1);

        if (error) {
            console.error("Error:", error);
            fs.writeFileSync('debug-highlight-output.txt', `Error: ${JSON.stringify(error)}`);
            return;
        }

        if (articles && articles.length > 0) {
            const a = articles[0];
            console.log("Found article:", a.title);
            const text = a.content || a.summary || "";
            fs.writeFileSync('debug-highlight-output.txt', text);
            console.log("Written to debug-highlight-output.txt");
        } else {
            console.log("No matching articles found.");
            fs.writeFileSync('debug-highlight-output.txt', "No matching articles found for %Dave%");
        }
    } catch (e) {
        console.error("Crash:", e);
        fs.writeFileSync('debug-highlight-output.txt', `Crash: ${e}`);
    }
}

check();
