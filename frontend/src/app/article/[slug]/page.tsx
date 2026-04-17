import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareBySlug } from '@/src/api/software/software.api';
import { me } from '@/src/api/auth/auth.api.server';
import { hasUserUsedSoftware } from '@/src/api/users/users.api';
import { getSoftwareReviewBySlug } from '@/src/api/reviews/reviews.api';
import { HTTPError } from 'ky';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';
import UseSoftwareButton from './_components/UseSoftwareButton';
import { notFound } from 'next/navigation';
import { GlobeIcon, Users, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/url';
import { SoftwareApplication, WithContext } from 'schema-dts';
import { safeJsonLdStringify } from '@/src/lib/utils';
import SoftwareReviewSection from '@/src/app/article/[slug]/_components/SoftwareReviewSection';
import ProsAndCons from '@/src/app/article/[slug]/_components/ProsAndCons';
import ScreenshotGallery from '@/src/app/article/[slug]/_components/ScreenshotGallery';
import SoftwareAlternatives from '@/src/app/article/[slug]/_components/SoftwareAlternatives';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const canonical = absoluteUrl(`/article/${slug}`);

    const defaultMeta = {
        title: 'Software Not Found | betterstack',
        description: 'The requested software could not be found.',
        alternates: { canonical },
    };

    const customMeta = await getCustomArticleMetadata(canonical, slug);

    return { ...defaultMeta, ...customMeta };
}

async function getCustomArticleMetadata(url: URL, slug: string) {
    const client = await createServerClient();

    try {
        const software = await getSoftwareBySlug(client, slug);
        const title = `${software.name} | betterstack`;
        const description =
            software.shortDescription ||
            `View details and features of ${software.name}.`;

        return {
            title,
            description,
            openGraph: { title, url, description },
        };
    } catch {
        return {};
    }
}

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

    let isAuthenticated: boolean;
    let isUsedByCurrentUser = false;
    let currentUser = null;

    try {
        const user = await me(client);
        isAuthenticated = user != null;
        currentUser = user;
    } catch {
        isAuthenticated = false;
    }

    if (isAuthenticated) {
        try {
            const { isUsed } = await hasUserUsedSoftware(client, software.id);
            isUsedByCurrentUser = isUsed;
        } catch {
            isUsedByCurrentUser = false;
        }
    }

    let review = null;
    try {
        review = await getSoftwareReviewBySlug(client, slugObject.slug);
    } catch (err) {
        // If 404, there's just no review
        if (!(err instanceof HTTPError && err.response.status === 404)) {
            console.error('Failed to fetch software review:', err);
        }
    }

    const canEdit = !!(
        currentUser &&
        (currentUser.role === 'admin' || currentUser.role === 'author')
    );
    const isDifferentAuthor = !!(
        review &&
        currentUser &&
        review.author.userId !== currentUser.id
    );
    const shouldShowEditButton = canEdit && !isDifferentAuthor;

    const categoryNames = software.categories.map((c) => c.name);

    const jsonLd: WithContext<SoftwareApplication> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: software.name,
        description: software.shortDescription || undefined,
        url: absoluteUrl(`/article/${slugObject.slug}`).toString(),
        applicationCategory:
            software.categories[0]?.name || 'BusinessApplication',
        operatingSystem: 'All',
        image: software.logoUrl || undefined,
        author: software.developer
            ? {
                  '@type': 'Organization',
                  name: software.developer,
              }
            : undefined,
        review: review?.author
            ? {
                  '@type': 'Review',
                  author: {
                      '@type': 'Person',
                      name: review.author.fullName || 'Anonymous',
                  },
                  reviewBody: review.content,
              }
            : undefined,
    };

    return (
        <article className="max-w-4xl mx-auto px-4 py-6 sm:p-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJsonLdStringify(jsonLd),
                }}
            />

            <nav
                aria-label="Breadcrumb"
                className="mb-6 text-sm font-medium text-zinc-400"
            >
                <ol className="flex items-center gap-2">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-zinc-100 transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    </li>
                    <li>
                        <Link
                            href="/catalog"
                            className="hover:text-zinc-100 transition-colors"
                        >
                            Catalog
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    </li>
                    <li className="text-zinc-100 truncate" aria-current="page">
                        {software.name}
                    </li>
                </ol>
            </nav>

            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mb-8">
                <div className="flex items-center gap-4 sm:gap-6">
                    {software.logoUrl && (
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 overflow-hidden shrink-0">
                            <Image
                                src={software.logoUrl}
                                alt={software.name}
                                fill
                                priority
                                sizes="(max-width: 640px) 64px, 96px"
                                className="object-contain"
                            />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                {software.name}
                            </h1>
                            {/* Usage Count Badge */}
                            <div
                                className="hidden sm:flex items-center gap-1.5 shrink-0 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-400"
                                title={`${software.usageCount} users use this`}
                            >
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                    {software.usageCount}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-1">
                            {software.developer && (
                                <p className="text-sm sm:text-lg text-zinc-400">
                                    Developer: {software.developer}
                                </p>
                            )}
                            {/* Usage Count Badge for Mobile (appears below name on small screens) */}
                            <div
                                className="flex sm:hidden items-center gap-1.5 shrink-0 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400"
                                title={`${software.usageCount} users use this`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">
                                    {software.usageCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icons & Actions*/}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
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

                    {isAuthenticated && (
                        <UseSoftwareButton
                            softwareId={software.id}
                            initialIsUsed={isUsedByCurrentUser}
                        />
                    )}
                </div>
            </header>

            <section className="mb-8 sm:mb-10">
                <h2 className="text-sm sm:text-md font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Categories
                </h2>
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
                {software.shortDescription && (
                    <div className="mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3">
                            Description
                        </h2>
                        <p className="text-base sm:text-lg font-medium">
                            {software.shortDescription}
                        </p>
                    </div>
                )}

                <SoftwareReviewSection
                    softwareSlug={slugObject.slug}
                    review={review}
                    canEdit={shouldShowEditButton}
                />

                {review?.author && (
                    <Link href={`/profile/${review.author.userId}`}>
                        <section className="my-8 sm:my-12 p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                                Written by
                            </h3>
                            <div className="flex items-center gap-4">
                                {review.author.avatarUrl ? (
                                    <Image
                                        src={review.author.avatarUrl}
                                        alt={review.author.fullName || 'Author'}
                                        width={48}
                                        height={48}
                                        className="rounded-full bg-zinc-800 object-cover w-12 h-12"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-semibold text-lg">
                                        {(review.author.fullName || 'A')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold text-zinc-100">
                                        {review.author.fullName || 'Anonymous'}
                                    </div>
                                    {review.author.bio && (
                                        <div className="text-sm text-zinc-400 mt-1 line-clamp-2">
                                            {review.author.bio}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </Link>
                )}
            </section>

            <div className="mb-8 sm:mb-12">
                <ScreenshotGallery screenshots={software.screenshots} />
            </div>

            <ProsAndCons
                softwareName={software.name}
                factors={software.factors}
            />

            <SoftwareAlternatives
                slug={software.slug}
                softwareName={software.name}
            />
        </article>
    );
}
