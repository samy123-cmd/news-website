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
    const { data: feeds, error } = await supabase
        .from('feeds')
        .select('*');

    if (error) {
        console.error("Error fetching feeds:", error);
    } else {
        console.log("--- Feeds in DB ---");
        feeds?.forEach(f => console.log(`[${f.category}] ${f.name} (${f.url}) - Active: ${f.active}`));
    }
}

run();
