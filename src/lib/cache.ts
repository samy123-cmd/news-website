/**
 * Performance & Caching Utilities
 * Centralized caching headers and strategies for API routes
 */

/**
 * Common cache control headers for different content types
 */
export const CacheHeaders = {
    /**
     * Static content that rarely changes (images, fonts, etc.)
     * Cache for 1 year with immutable flag
     */
    STATIC: {
        'Cache-Control': 'public, max-age=31536000, immutable',
    },

    /**
     * Article pages - stale-while-revalidate pattern
     * Serve stale content while fetching fresh data in background
     */
    ARTICLE: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },

    /**
     * Homepage/Category pages - shorter cache with SWR
     */
    FEED: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },

    /**
     * API responses - short cache for dynamic data
     */
    API_SHORT: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },

    /**
     * API responses - medium cache for semi-dynamic data
     */
    API_MEDIUM: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },

    /**
     * No caching for sensitive/real-time data
     */
    NO_CACHE: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    },

    /**
     * Private cache for user-specific data
     */
    PRIVATE: {
        'Cache-Control': 'private, max-age=60',
    },
};

/**
 * Response helpers with proper caching headers
 */
export function jsonWithCache<T>(
    data: T,
    cacheType: keyof typeof CacheHeaders = 'API_SHORT',
    status = 200
): Response {
    return Response.json(data, {
        status,
        headers: {
            ...CacheHeaders[cacheType],
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Error response (no caching)
 */
export function jsonError(
    message: string,
    status = 500
): Response {
    return Response.json(
        { error: message },
        {
            status,
            headers: {
                ...CacheHeaders.NO_CACHE,
                'Content-Type': 'application/json',
            },
        }
    );
}

/**
 * Vercel-specific edge caching configuration
 * Use in API routes for CDN caching
 */
export const edgeCacheConfig = {
    /**
     * Cache at Vercel edge for 60 seconds
     */
    SHORT: {
        runtime: 'edge' as const,
        revalidate: 60,
    },

    /**
     * Cache at Vercel edge for 5 minutes
     */
    MEDIUM: {
        runtime: 'edge' as const,
        revalidate: 300,
    },

    /**
     * Cache at Vercel edge for 1 hour
     */
    LONG: {
        runtime: 'edge' as const,
        revalidate: 3600,
    },
};
