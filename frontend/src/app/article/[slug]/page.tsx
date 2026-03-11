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
        <article className="max-w-4xl mx-auto px-4 py-6 sm:p-6 md:py-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mb-8">
                <div className="flex items-center gap-4 sm:gap-6">
                    {software.logoUrl && (
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 overflow-hidden shrink-0">
                            <Image
                                src={software.logoUrl}
                                alt={software.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            {software.name}
                        </h1>
                        {software.developer && (
                            <p className="text-sm sm:text-lg text-zinc-400 mt-1">
                                Developer: {software.developer}
                            </p>
                        )}
                    </div>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                    {software.gitRepoUrl && (
                        <Link
                            href={software.gitRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300 shrink-0"
                        >
                            <Image
                                src="/github-logo.svg"
                                alt="GitHub"
                                width={24}
                                height={24}
                                className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90"
                            />
                        </Link>
                    )}
                    {software.websiteUrl && (
                        <Link
                            href={software.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300 shrink-0"
                        >
                            <GlobeIcon
                                className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300"
                                strokeWidth={1.5}
                            />
                        </Link>
                    )}
                </div>
            </header>

            <section className="mb-8 sm:mb-10">
                <h3 className="text-sm sm:text-md font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Categories
                </h3>
                <div>
                    {categoryNames.length === 0 && (
                        <p className="text-base sm:text-lg font-medium">
                            No categories
                        </p>
                    )}
                    <CategoryTags categories={categoryNames} showAll={true} />
                </div>
            </section>

            <section className="mb-8 sm:mb-12">
                {software.shortDescription || software.fullDescription ? (
                    <>
                        <h2 className="text-lg sm:text-xl font-semibold mb-3">
                            Description
                        </h2>
                        <p className="text-base sm:text-lg font-medium mb-5">
                            {software.shortDescription}
                        </p>
                        {software.fullDescription && (
                            <div className="max-w-none prose prose-sm sm:prose-base prose-zinc prose-invert">
                                <Markdown content={software.fullDescription} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
                            No description
                        </h2>
                        <hr className="my-4 border-zinc-800" />
                    </>
                )}
            </section>

            <div className="mb-8 sm:mb-12">
                <ScreenshotGallery screenshots={software.screenshotUrls} />
            </div>

            {(software.factors?.positive?.length > 0 ||
                software.factors?.negative?.length > 0) && (
                <section className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 whitespace-nowrap">
                            Pros & Cons
                        </h2>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6">
                        {software.factors.positive?.length > 0 && (
                            <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                                <h3 className="text-base sm:text-lg font-semibold text-zinc-200 flex items-center justify-center gap-2">
                                    <ThumbsUpIcon className="text-zinc-500 shrink-0 w-5 h-5" />
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
                                                    className="w-4.5 h-4.5"
                                                    strokeWidth={3}
                                                />
                                            </span>
                                            <span className="text-sm sm:text-base text-zinc-300">
                                                {factor.factorName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {software.factors.negative?.length > 0 && (
                            <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                                <h3 className="text-base sm:text-lg font-semibold text-zinc-200 flex items-center justify-center gap-2">
                                    <ThumbsDownIcon className="text-zinc-500 shrink-0 w-5 h-5" />
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
                                                    className="w-4.5 h-4.5"
                                                    strokeWidth={3}
                                                />
                                            </span>
                                            <span className="text-sm sm:text-base text-zinc-300">
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
