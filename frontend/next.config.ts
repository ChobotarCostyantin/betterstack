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
};

export default nextConfig;
