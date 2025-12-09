/**
 * Token Bucket Rate Limiter
 * Implements rate limiting with exponential backoff for API calls.
 */

interface RateLimiterConfig {
    maxTokens: number;      // Max requests allowed in the bucket
    refillRate: number;     // Tokens added per second
    minWaitMs: number;      // Minimum wait between requests
}

interface RateLimiterState {
    tokens: number;
    lastRefill: number;
    consecutiveFailures: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
    maxTokens: 5,           // 5 requests max in bucket
    refillRate: 0.1,        // 1 token every 10 seconds (6 RPM)
    minWaitMs: 2000         // Minimum 2s between requests
};

// Global state
let state: RateLimiterState = {
    tokens: DEFAULT_CONFIG.maxTokens,
    lastRefill: Date.now(),
    consecutiveFailures: 0
};

/**
 * Refill tokens based on elapsed time
 */
function refillTokens(config: RateLimiterConfig = DEFAULT_CONFIG): void {
    const now = Date.now();
    const elapsed = (now - state.lastRefill) / 1000; // seconds
    const tokensToAdd = elapsed * config.refillRate;

    state.tokens = Math.min(config.maxTokens, state.tokens + tokensToAdd);
    state.lastRefill = now;
}

/**
 * Calculate backoff delay with jitter
 */
function getBackoffDelay(failures: number): number {
    // Base delay: 10s, 20s, 40s, 80s...capped at 120s
    const baseDelay = Math.min(10000 * Math.pow(2, failures), 120000);
    // Add jitter: ±20%
    const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
    return Math.round(baseDelay + jitter);
}

/**
 * Acquire a token, waiting if necessary
 * Returns true if token acquired, false if should skip
 */
export async function acquireToken(config: RateLimiterConfig = DEFAULT_CONFIG): Promise<boolean> {
    refillTokens(config);

    // If we have tokens, use one
    if (state.tokens >= 1) {
        state.tokens -= 1;

        // Still enforce minimum wait
        await new Promise(resolve => setTimeout(resolve, config.minWaitMs));
        return true;
    }

    // No tokens available - calculate wait time
    const tokensNeeded = 1 - state.tokens;
    const waitTime = (tokensNeeded / config.refillRate) * 1000;

    // If wait is too long (>60s), skip
    if (waitTime > 60000) {
        console.warn(`[Rate Limiter] Wait time too long (${Math.round(waitTime / 1000)}s). Skipping.`);
        return false;
    }

    console.log(`[Rate Limiter] Waiting ${Math.round(waitTime / 1000)}s for rate limit...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    refillTokens(config);
    if (state.tokens >= 1) {
        state.tokens -= 1;
        return true;
    }

    return false;
}

/**
 * Record a successful API call (resets failure counter)
 */
export function recordSuccess(): void {
    state.consecutiveFailures = 0;
}

/**
 * Record a failed API call (increases backoff)
 */
export function recordFailure(): void {
    state.consecutiveFailures += 1;
}

/**
 * Get delay to wait after a rate limit error
 */
export async function waitForBackoff(): Promise<void> {
    const delay = getBackoffDelay(state.consecutiveFailures);
    console.warn(`[Rate Limiter] Backing off for ${Math.round(delay / 1000)}s (failure #${state.consecutiveFailures + 1})`);
    await new Promise(resolve => setTimeout(resolve, delay));
    recordFailure();
}

/**
 * Reset the rate limiter state
 */
export function resetRateLimiter(): void {
    state = {
        tokens: DEFAULT_CONFIG.maxTokens,
        lastRefill: Date.now(),
        consecutiveFailures: 0
    };
}

/**
 * Get current rate limiter status (for debugging)
 */
export function getRateLimiterStatus(): { tokens: number; failures: number } {
    refillTokens();
    return {
        tokens: Math.round(state.tokens * 100) / 100,
        failures: state.consecutiveFailures
    };
}
