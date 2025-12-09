import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Connection pool-like behavior via singleton pattern
let clientInstance: ReturnType<typeof createServerClient> | null = null;
let lastCreated = 0;
const CLIENT_TTL = 1000 * 60 * 5; // Refresh connection every 5 minutes

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function createClient() {
    const cookieStore = await cookies()

    // Reuse existing client if still valid (connection pooling best practice)
    const now = Date.now();
    if (clientInstance && (now - lastCreated) < CLIENT_TTL) {
        return clientInstance;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            clientInstance = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return cookieStore.getAll()
                        },
                        setAll(cookiesToSet) {
                            try {
                                cookiesToSet.forEach(({ name, value, options }) =>
                                    cookieStore.set(name, value, options)
                                )
                            } catch {
                                // The `setAll` method was called from a Server Component.
                                // This can be ignored if you have middleware refreshing
                                // user sessions.
                            }
                        },
                    },
                }
            );

            lastCreated = now;
            return clientInstance;
        } catch (error) {
            lastError = error as Error;
            console.error(`[Supabase] Connection attempt ${attempt}/${MAX_RETRIES} failed:`, error);

            if (attempt < MAX_RETRIES) {
                await sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
            }
        }
    }

    throw new Error(`Failed to connect to Supabase after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Reset the client instance (useful for testing or forced reconnection)
 */
export function resetClient() {
    clientInstance = null;
    lastCreated = 0;
}
