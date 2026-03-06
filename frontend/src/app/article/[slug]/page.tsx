import { Software } from '@/src/lib/types';
import { getSoftwareBySlugAction } from '@/src/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';
import ScreenshotGallery from './_components/ScreenshotGallery';
import ReactMarkdown from 'react-markdown';

export default async function SoftwareArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slugObject = await params;
    const software: Software = await getSoftwareBySlugAction(slugObject.slug);
    const sortedCategories = software.categoryIds.sort((a, b) => a - b);

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

                <div className='flex gap-5 mt-4'>
                    {software.githubUrl && (
                        <Link
                            href={software.githubUrl}
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
                            <Image
                                src="/website.svg"
                                alt="Website"
                                width={40}
                                height={40}
                                className="hover:scale-110 hover:opacity-60 transition-all duration-300"
                            />
                        </Link>
                    )}
                </div>
            </header>

            <section className="mb-8">
                {/* <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Categories
                </h3> */}
                <div className="">
                    <CategoryTags
                        categoryIds={sortedCategories}
                        showAll={true}
                    />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
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
            </section>

            <ScreenshotGallery screenshots={software.screenshots} />

            <section className="bg-zinc-800 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">
                    Features
                </h2>
                <dl className=" gap-x-8 gap-y-4">
                    {Object.entries(software.features).map(([key, value]) => (
                        <div
                            key={key}
                            className="border-b border-zinc-700 pb-2"
                        >
                            <dt className="text-sm text-gray-400 font-medium">
                                Criteria: {key}
                            </dt>
                            <dd className="text-base">{String(value)}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </article>
    );
}
