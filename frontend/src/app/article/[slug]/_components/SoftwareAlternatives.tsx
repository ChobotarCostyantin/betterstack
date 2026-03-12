import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareAlternatives } from '@/src/api/software/software.api';
import Image from 'next/image';
import Link from 'next/link';

interface SoftwareAlternativesProps {
    slug: string;
    softwareName: string;
}

export default async function SoftwareAlternatives({
    slug,
    softwareName,
}: SoftwareAlternativesProps) {
    const client = await createServerClient();

    let alternatives;
    try {
        alternatives = await getSoftwareAlternatives(client, slug, {
            perPage: 4,
        });
    } catch (error) {
        console.error('Failed to fetch alternatives:', error);
        return null;
    }

    const items = alternatives?.data || [];

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="mb-8 sm:mb-12 mt-12 pt-8 border-zinc-800/80">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 whitespace-nowrap">
                    Alternatives to {softwareName}
                </h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((alt) => (
                    <div
                        key={alt.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/60 transition-colors group"
                    >
                        <Link
                            href={`/article/${alt.slug}`}
                            className="flex items-center gap-4 flex-1 min-w-0"
                        >
                            {alt.logoUrl ? (
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ">
                                    <Image
                                        unoptimized
                                        src={alt.logoUrl}
                                        alt={`${alt.name} logo`}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-950 shrink-0 border border-zinc-800/50">
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                                        N/A
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate text-sm sm:text-base">
                                    {alt.name}
                                </span>
                                {alt.shortDescription && (
                                    <span className="text-xs sm:text-sm text-zinc-500 truncate">
                                        {alt.shortDescription}
                                    </span>
                                )}
                            </div>
                        </Link>

                        <Link
                            href={`/comparison?firstSoft=${slug}&secondSoft=${alt.slug}`}
                            className="shrink-0 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/20 rounded-lg transition-colors"
                        >
                            Compare
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
