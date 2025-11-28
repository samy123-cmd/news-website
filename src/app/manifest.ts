
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Global AI News',
        short_name: 'AI News',
        description: 'Real-time AI-curated news from around the world.',
        start_url: '/',
        display: 'standalone',
        background_color: '#08101a',
        theme_color: '#1ea7ff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
