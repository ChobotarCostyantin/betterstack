import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import SearchBar from './_components/SearchBar';
import { createServerClient } from '@/src/lib/api/server.client';
import { getMostUsedSoftware } from '@/src/api/software/software.api';
import SoftwareCard from '@/src/components/SoftwareCard';
import { Metadata } from 'next';
import { WebSite, WithContext } from 'schema-dts';
import { absoluteUrl } from '../lib/url';

const canonical = absoluteUrl('/');

export const metadata: Metadata = {
    title: 'Home | betterstack',
    description: 'View and choose the best software.',
    alternates: { canonical },
    openGraph: {
        url: canonical,
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
            },
        ],
    },
};

export default async function Home() {
    const client = await createServerClient();
    const featuredSoftware = await getMostUsedSoftware(client, 3);

    const jsonLd: WithContext<WebSite> = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'betterstack',
        url: absoluteUrl('/').toString(),
        description:
            'Search through our database of software, libraries, and tools.',
    };

    return (
        <div className="flex flex-col items-center min-h-[70vh] px-4 pt-32 pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="text-center mb-10 w-full">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                    Find the perfect{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-600">
                        stack
                    </span>
                </h1>
                <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                    Search through our database of software, libraries, and
                    tools to build your next big project.
                </p>
            </div>

            <SearchBar />

            <div className="mt-24 w-full max-w-4xl">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6 text-center">
                    Popular software
                </h2>

                <div className="flex flex-wrap justify-center gap-4">
                    {featuredSoftware.map((item) => (
                        <SoftwareCard key={item.id} item={item} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-0.5 bg-linear-to-r from-zinc-400 to-zinc-600 rounded-full blur-md opacity-25 group-hover:opacity-50 transition duration-500"></div>

                        <Link
                            href="/catalog"
                            className="relative flex items-center gap-x-2 px-6 py-3 bg-zinc-900 text-zinc-300 hover:text-white rounded-full border border-zinc-800 transition-all duration-300"
                        >
                            <span>View all software</span>
                            <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
