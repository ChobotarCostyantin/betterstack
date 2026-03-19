import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',

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
