import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',

    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp|avif|ttf|woff2)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    experimental: {
        authInterrupts: true,
    },
    compiler: {
        removeConsole:
            process.env.NODE_ENV === 'production'
                ? { exclude: ['error'] }
                : false,
    },
};

export default nextConfig;
