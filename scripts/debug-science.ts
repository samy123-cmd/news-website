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

import * as fs from 'fs';

async function check() {
    let output = "Checking Science category...\n";

    // 1. Check Feeds
    const { data: feeds, error: feedError } = await supabase
        .from('feeds')
        .select('*')
        .eq('category', 'Science');

    if (feedError) {
        output += `Error fetching feeds: ${JSON.stringify(feedError)}\n`;
    } else {
        output += `Found ${feeds?.length || 0} Science feeds.\n`;
        feeds?.forEach(f => output += `- ${f.name}: ${f.url} (Active: ${f.active})\n`);
    }

    // 2. Check Articles
    const { count, error: articleError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'Science');

    if (articleError) {
        output += `Error fetching articles: ${JSON.stringify(articleError)}\n`;
    } else {
        output += `Found ${count} Science articles.\n`;
    }

    fs.writeFileSync('debug-science-output.txt', output);
    console.log("Written to debug-science-output.txt");
}

check();
