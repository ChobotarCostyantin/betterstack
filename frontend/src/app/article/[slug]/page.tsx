import { Software } from '@/src/lib/types';
import { getSoftwareBySlugAction } from '@/src/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';

export default async function SoftwareArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slugObject = await params;
    const software: Software = await getSoftwareBySlugAction(slugObject.slug);

    return (
        <article className="max-w-4xl mx-auto p-6">
            <header className="flex items-center gap-6 mb-8">
                {software.logoUrl && (
                    <div className="relative w-24 h-24 overflow-hidden">
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
                        <p className="text-lg text-blue-700">
                            Developer: {software.developer}
                        </p>
                    )}
                </div>
            </header>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-lg font-medium mb-4">
                    {software.shortDescription}
                </p>
                {software.fullDescription && (
                    <div className="max-w-none text-zinc-500">
                        {software.fullDescription}
                    </div>
                )}
            </section>

            <section className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Categories
                </h3>
                <div className="flex gap-2">
                    <CategoryTags
                        categoryIds={software.categoryIds}
                        showAll={true}
                    />
                </div>
            </section>

            <section className="flex gap-4 mb-8">
                {software.websiteUrl && (
                    <Link
                        href={software.websiteUrl}
                        className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                    >
                        Official website
                    </Link>
                )}
                {software.githubUrl && (
                    <Link
                        href={software.githubUrl}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        GitHub
                    </Link>
                )}
            </section>

            {software.screenshots && software.screenshots.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {software.screenshots.map((url, index) => (
                            <div
                                key={index}
                                className="relative aspect-video border rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="bg-zinc-800 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">
                    Features
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(software.features).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                            <dt className="text-sm text-gray-500 font-medium">
                                Criteria: {key}
                            </dt>
                            <dd className="text-base text-gray-900">
                                {String(value)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </article>
    );
}
