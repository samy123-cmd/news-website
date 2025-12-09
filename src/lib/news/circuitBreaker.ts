/**
 * Circuit Breaker for RSS Feed Management
 * Tracks feed failures and temporarily disables problematic feeds.
 */

import { createClient } from '@supabase/supabase-js';

interface FeedStatus {
    url: string;
    lastSuccess: Date | null;
    failureCount: number;
    lastFailure: Date | null;
    disabled: boolean;
    disabledUntil: Date | null;
}

// In-memory cache for feed status (refreshed from DB periodically)
const feedStatusCache = new Map<string, FeedStatus>();
let lastCacheRefresh = 0;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

// Circuit breaker thresholds
const FAILURE_THRESHOLD = 3;
const DISABLE_DURATION_HOURS = 24;

function getSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false }
    });
}

/**
 * Initialize feed status table if needed
 */
export async function initFeedStatusTable() {
    const supabase = getSupabase();

    // Check if table exists by trying a query
    const { error } = await supabase
        .from('feed_status')
        .select('url')
        .limit(1);

    if (error?.code === '42P01') {
        // Table doesn't exist - would need to create via migration
        console.warn('[Circuit Breaker] feed_status table not found. Using in-memory tracking only.');
        return false;
    }

    return true;
}

/**
 * Check if a feed is currently disabled
 */
export function isFeedDisabled(url: string): boolean {
    const status = feedStatusCache.get(url);
    if (!status) return false;

    if (status.disabled && status.disabledUntil) {
        // Check if disable period has passed
        if (new Date() > status.disabledUntil) {
            status.disabled = false;
            status.failureCount = 0;
            return false;
        }
        return true;
    }

    return false;
}

/**
 * Record a successful feed fetch
 */
export function recordFeedSuccess(url: string): void {
    const status = feedStatusCache.get(url) || createDefaultStatus(url);
    status.lastSuccess = new Date();
    status.failureCount = 0;
    status.disabled = false;
    status.disabledUntil = null;
    feedStatusCache.set(url, status);
}

/**
 * Record a feed fetch failure
 */
export function recordFeedFailure(url: string): void {
    const status = feedStatusCache.get(url) || createDefaultStatus(url);
    status.failureCount += 1;
    status.lastFailure = new Date();

    if (status.failureCount >= FAILURE_THRESHOLD) {
        status.disabled = true;
        status.disabledUntil = new Date(Date.now() + DISABLE_DURATION_HOURS * 60 * 60 * 1000);
        console.warn(`[Circuit Breaker] Feed disabled for ${DISABLE_DURATION_HOURS}h: ${url} (${status.failureCount} failures)`);
    }

    feedStatusCache.set(url, status);
}

/**
 * Get status of all feeds
 */
export function getAllFeedStatus(): FeedStatus[] {
    return Array.from(feedStatusCache.values());
}

/**
 * Get count of disabled feeds
 */
export function getDisabledFeedCount(): number {
    return Array.from(feedStatusCache.values()).filter(s => s.disabled).length;
}

function createDefaultStatus(url: string): FeedStatus {
    return {
        url,
        lastSuccess: null,
        failureCount: 0,
        lastFailure: null,
        disabled: false,
        disabledUntil: null
    };
}
