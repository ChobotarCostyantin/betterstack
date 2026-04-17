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
