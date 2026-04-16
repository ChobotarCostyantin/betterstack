import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/src/lib/url';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/login', '/register'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
