import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewsCard } from './NewsCard';
import { BookmarkProvider } from '@/lib/context/BookmarkContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock dependencies
jest.mock('next/link', () => {
    return ({ children, href, onClick }: any) => {
        return (
            <a href={href} onClick={onClick} data-testid="next-link">
                {children}
            </a>
        );
    };
});

jest.mock('next/image', () => {
    return ({ src, alt, fill, className }: any) => (
        <img src={src} alt={alt} className={className} data-testid="next-image" />
    );
});

jest.mock('@/lib/utils', () => ({
    cn: (...inputs: any[]) => inputs.join(' '),
}));

jest.mock('date-fns', () => ({
    formatDistanceToNow: () => '5 mins ago',
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
    },
}));

jest.mock('lucide-react', () => ({
    Calendar: () => <div data-testid="icon-calendar" />,
    Share2: () => <div data-testid="icon-share" />,
    ExternalLink: () => <div data-testid="icon-external-link" />,
    Clock: () => <div data-testid="icon-clock" />,
    Zap: () => <div data-testid="icon-zap" />,
    Bookmark: () => <div data-testid="icon-bookmark" />,
    ArrowRight: () => <div data-testid="icon-arrow-right" />,
    Sparkles: () => <div data-testid="icon-sparkles" />,
}));

jest.mock('@/components/ui/Button', () => ({
    Button: ({ children, onClick, className }: any) => (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    ),
}));

jest.mock('@/components/ui/Toast', () => ({
    useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@/lib/context/LanguageContext', () => ({
    useLanguage: () => ({ language: 'en', t: (key: string) => key }),
}));

jest.mock('@/lib/context/BookmarkContext', () => ({
    useBookmarks: () => ({
        addBookmark: jest.fn(),
        removeBookmark: jest.fn(),
        isBookmarked: jest.fn(() => false),
    }),
    BookmarkProvider: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tooltip', () => ({
    Tooltip: ({ children }: any) => <div>{children}</div>,
    TooltipContent: ({ children }: any) => <div>{children}</div>,
    TooltipProvider: ({ children }: any) => <div>{children}</div>,
    TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/lib/analytics', () => ({
    analytics: {
        track: jest.fn(),
    },
}));

jest.mock('@/lib/constants', () => ({
    getImageForCategory: () => 'https://example.com/default.jpg',
}));

jest.mock('@/lib/utils/text', () => ({
    stripHtml: (text: string) => text,
}));

const mockArticle = {
    id: '123',
    title: 'Test Article Title',
    summary: 'Test Article Summary',
    content: 'Test Article Content',
    url: 'https://example.com/article',
    source: 'Test Source',
    published_at: new Date().toISOString(),
    category: 'Technology',
    subcategory: 'AI',
    image_url: 'https://example.com/image.jpg',
    sentiment: 'neutral',
    read_time: "5 min",
};

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <>
            {component}
        </>
    );
};

describe('NewsCard Component', () => {
    it('renders correctly', () => {
        renderWithProviders(<NewsCard article={mockArticle as any} index={0} />);
        expect(screen.getByText('Test Article Title')).toBeInTheDocument();
        expect(screen.getByText('Test Source')).toBeInTheDocument();
    });

    it('has a clickable "Read Full Story" button', () => {
        renderWithProviders(<NewsCard article={mockArticle as any} index={0} />);

        const readButton = screen.getByText('Read Full Story');
        expect(readButton).toBeInTheDocument();

        // Check if it's wrapped in a link
        const link = readButton.closest('a');
        expect(link).toHaveAttribute('href', '/article/123');

        // Simulate click
        fireEvent.click(readButton);
    });

    it('has clickable footer actions', () => {
        renderWithProviders(<NewsCard article={mockArticle as any} index={0} />);

        // Bookmark button
        const bookmarkButton = screen.getAllByRole('button')[0];
        fireEvent.click(bookmarkButton);
    });
});
