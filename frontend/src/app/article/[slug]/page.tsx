import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareBySlug } from '@/src/api/software/software.api';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';
import ScreenshotGallery from './_components/ScreenshotGallery';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { GlobeIcon } from 'lucide-react';

export default async function SoftwareArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slugObject = await params;
    const client = await createServerClient();

    let software;
    try {
        software = await getSoftwareBySlug(client, slugObject.slug);
    } catch {
        notFound();
    }

    const categoryNames = software.categories.map((c) => c.name);

    return (
        <article className="max-w-4xl mx-auto p-6">
            <header className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-6">
                    {software.logoUrl && (
                        <div className="relative w-24 h-24 overflow-hidden shrink-0">
                            <Image
                                src={software.logoUrl}
                                alt={software.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl font-bold">{software.name}</h1>
                        {software.developer && (
                            <p className="text-lg text-zinc-400">
                                Developer: {software.developer}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-5 mt-4">
                    {software.gitRepoUrl && (
                        <Link
                            href={software.gitRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                        >
                            <Image
                                src="/github-logo.svg"
                                alt="GitHub"
                                width={40}
                                height={40}
                                className="hover:scale-110 hover:opacity-60 transition-all duration-300"
                            />
                        </Link>
                    )}
                    {software.websiteUrl && (
                        <Link
                            href={software.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                        >
                            <GlobeIcon
                                color="#f4f4f5"
                                size={40}
                                className="hover:scale-110 hover:opacity-60 transition-all duration-300"
                            />
                        </Link>
                    )}
                </div>
            </header>

            <section className="mb-8">
                <h3 className="text-md font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Categories
                </h3>
                <div>
                    {categoryNames.length === 0 && (
                        <p className="text-lg font-medium">No categories</p>
                    )}
                    <CategoryTags categories={categoryNames} showAll={true} />
                </div>
            </section>

            <section className="mb-8">
                {software.shortDescription || software.fullDescription ? (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Description
                        </h2>
                        <p className="text-lg font-medium mb-4">
                            {software.shortDescription}
                        </p>
                        <hr className="my-4 border-zinc-800" />{' '}
                        {software.fullDescription && (
                            <div className="max-w-none prose prose-zinc prose-invert">
                                <ReactMarkdown>
                                    {software.fullDescription}
                                </ReactMarkdown>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            No description
                        </h2>
                        <hr className="my-4 border-zinc-800" />{' '}
                    </>
                )}
            </section>

            <ScreenshotGallery screenshots={software.screenshotUrls} />

            {software.factors.positive.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-zinc-100">
                            Features
                        </h2>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    <dl className="flex flex-col gap-3">
                        {software.factors.positive.map((factor) => (
                            <div
                                key={factor.factorId}
                                className="group flex flex-row items-center gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-500 transition-all duration-300"
                            >
                                <dt className="text-sm font-medium text-zinc-400">
                                    <div className="w-8 h-8 shrink-0 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500/50 group-hover:bg-zinc-500/10 transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600/80 group-hover:bg-gray-400 transition-colors" />
                                    </div>
                                </dt>
                                <dd className="text-base font-semibold text-zinc-200">
                                    {factor.factorName}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </article>
    );
}
