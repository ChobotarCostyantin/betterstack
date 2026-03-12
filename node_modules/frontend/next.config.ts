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
};

export default nextConfig;
