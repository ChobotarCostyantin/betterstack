import type { MetadataRoute } from 'next';
import { createServerClient } from '@/src/lib/api/server.client';
import { listSoftware } from '@/src/api/software/software.api';
import { listAuthors } from '@/src/api/users/users.api';
import { BASE_URL } from '@/src/lib/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, priority: 1.0 },
        { url: `${BASE_URL}/catalog`, priority: 0.9 },
        { url: `${BASE_URL}/comparison`, priority: 0.7 },
        { url: `${BASE_URL}/about`, priority: 0.5 },
    ];

    const articleRoutes: MetadataRoute.Sitemap = [];
    let profileRoutes: MetadataRoute.Sitemap = [];

    try {
        const client = await createServerClient();

        // Paginate through all software entries
        let page = 1;
        const perPage = 100;
        while (true) {
            const res = await listSoftware(client, { page, perPage });
            const items = res.data ?? [];

            articleRoutes.push(
                ...items.map((s) => ({
                    url: `${BASE_URL}/article/${s.slug}`,
                    priority: 0.8 as const,
                })),
            );

            if (page >= (res.meta?.totalPages ?? 1)) break;
            page++;
        }

        // Authors have public profile pages worth indexing
        const authors = await listAuthors(client);
        profileRoutes = authors.flatMap((a) => [
            { url: `${BASE_URL}/profile/${a.userId}`, priority: 0.6 as const },
            {
                url: `${BASE_URL}/profile/${a.userId}/stack`,
                priority: 0.6 as const,
            },
        ]);
    } catch (error) {
        console.error('sitemap: failed to fetch dynamic routes', error);
    }

    return [...staticRoutes, ...articleRoutes, ...profileRoutes];
}
