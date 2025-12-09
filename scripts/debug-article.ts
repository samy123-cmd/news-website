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
    // Get an article with content
    const { data: articles, error } = await supabase
        .from('articles')
        .select('title, content')
        .not('content', 'is', null)
        .limit(1);

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (articles && articles.length > 0) {
        const a = articles[0];
        const text = a.content || "";

        console.log("Found article:", a.title);
        console.log("Length:", text.length);

        const output = `
Title: ${a.title}
Total Length: ${text.length}
Single Newlines (\\n): ${(text.match(/\n/g) || []).length}
Double Newlines (\\n\\n): ${(text.match(/\n\n/g) || []).length}
Carriage Returns (\\r): ${(text.match(/\r/g) || []).length}
Sample (first 200 chars): ${JSON.stringify(text.substring(0, 200))}
        `;

        fs.writeFileSync('debug-output.txt', output);
        console.log("Written to debug-output.txt");
    } else {
        console.log("No articles with content found.");
    }
}

check();
