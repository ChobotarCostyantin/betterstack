import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareBySlug } from '@/src/api/software/software.api';
import { HTTPError } from 'ky';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';
import ScreenshotGallery from './_components/ScreenshotGallery';
import Markdown from './_components/Markdown';
import { notFound } from 'next/navigation';
import {
    CheckIcon,
    GlobeIcon,
    MinusIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
} from 'lucide-react';

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
    } catch (err) {
        if (err instanceof HTTPError && err.response.status === 404) notFound();
        throw err;
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
                        <h1 className="text-2xl sm:text-4xl font-bold">
                            {software.name}
                        </h1>
                        {software.developer && (
                            <p className="text-lg text-zinc-400">
                                Developer: {software.developer}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-5 mt-4">
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
                        {software.fullDescription && (
                            <div className="max-w-none prose prose-zinc prose-invert">
                                <Markdown content={software.fullDescription} />
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

            {(software.factors?.positive?.length > 0 ||
                software.factors?.negative?.length > 0) && (
                <section className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-zinc-100">
                            Pros & Cons
                        </h2>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        {software.factors.positive?.length > 0 && (
                            <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                                <h3 className="text-lg font-semibold text-zinc-200 flex justify-center items-center gap-2">
                                    <ThumbsUpIcon
                                        className="text-zinc-500 shrink-0"
                                        size={20}
                                    />
                                    Pros of {software.name}
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {software.factors.positive.map((factor) => (
                                        <li
                                            key={factor.factorId}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="mt-0.5 shrink-0 text-zinc-500/80">
                                                <CheckIcon
                                                    size={18}
                                                    strokeWidth={3}
                                                />
                                            </span>
                                            <span className="text-base text-zinc-300">
                                                {factor.factorName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {software.factors.negative?.length > 0 && (
                            <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                                <h3 className="text-lg font-semibold text-zinc-200 flex justify-center items-center gap-2">
                                    <ThumbsDownIcon
                                        className="text-zinc-500 shrink-0"
                                        size={20}
                                    />
                                    Cons of {software.name}
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {software.factors.negative.map((factor) => (
                                        <li
                                            key={factor.factorId}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="mt-0.5 shrink-0 text-zinc-500/80">
                                                <MinusIcon
                                                    size={18}
                                                    strokeWidth={3}
                                                />
                                            </span>
                                            <span className="text-base text-zinc-300">
                                                {factor.factorName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </article>
    );
}
