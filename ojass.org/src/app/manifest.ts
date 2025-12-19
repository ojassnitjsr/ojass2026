import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'OJASS 2026 | NIT Jamshedpur',
        short_name: 'OJASS 2026',
        description: 'Join us for OJASS 2026, the premier annual techno-management festival featuring cutting-edge technology, innovation, and exciting competitions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            // You can add more icons here corresponding to files in public/
        ],
    }
}
