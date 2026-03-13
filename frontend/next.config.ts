import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',

    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ];
    },
    images: {
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

    async rewrites() {
        const backendUrl =
            process.env.BACKEND_BASE_URL || 'http://localhost:3010/api/v1';

        return [
            {
                source: '/api/v1/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ];
    },
};

export default nextConfig;
