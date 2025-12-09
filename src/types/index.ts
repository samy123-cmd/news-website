/**
 * Shared TypeScript Types for the News Application
 */

// ============= Article Types =============

export interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    url: string;
    source: string;
    published_at: string;
    created_at?: string;
    category: string;
    subcategory?: string;
    image_url?: string;
    images?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    read_time?: string | number;
    tags?: string[];
    curation_note?: string | null;
    ai_processed?: boolean;
    byline?: string;
    view_count?: number;
}

export interface ArticlePreview {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    image_url?: string;
    category?: string;
    read_time?: string;
}

// ============= Polisher Types =============

export interface PolishedContent {
    headline: string;
    summary: string;
    content: string;
    category: string;
    subcategory: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    readTime: string;
    tags?: string[];
    curation_note?: string | null;
    ai_processed?: boolean;
}

// ============= Feed Types =============

export interface FeedConfig {
    url: string;
    category: string;
}

export interface FeedStatus {
    url: string;
    lastSuccess: Date | null;
    failureCount: number;
    lastFailure: Date | null;
    disabled: boolean;
    disabledUntil: Date | null;
}

// ============= API Response Types =============

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
        database: { status: string; latency?: number };
        ai: { status: string; model?: string; error?: string };
        rateLimiter: { tokens: number; failures: number };
    };
    version: string;
}

// ============= UI Types =============

export interface EmptyStateVariant {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}

// ============= Bookmark Types =============

export interface BookmarkedArticle {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    image_url?: string;
    category?: string;
    url: string;
}
