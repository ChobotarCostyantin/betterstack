import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',

    env: {
        BACKEND_BASE_URL:
            process.env.BACKEND_BASE_URL ?? 'http://localhost:3010/api/v1',
    },

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
