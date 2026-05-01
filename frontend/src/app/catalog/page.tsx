import Link from 'next/link';
import SoftwareCard from '@/src/components/SoftwareCard';
import { createServerClient } from '@/src/lib/api/server.client';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';
import { listSoftware } from '@/src/api/software/software.api';
import {
    listCategories,
    getCategoryBySlug,
} from '@/src/api/categories/categories.api';
import Pagination from './_components/Pagination';
import CategoryList from './_components/CategoryList';
import CatalogSearchBar from './_components/CatalogSearchBar';
import { CategoryListItem } from '@/src/api/categories/categories.schemas';
import { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/url';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const params = await searchParams;

    const canonicalParams = new URLSearchParams();
    if (typeof params.category === 'string')
        canonicalParams.set('category', params.category);
    if (typeof params.q === 'string') canonicalParams.set('q', params.q);
    if (typeof params.page === 'string') {
        const page = parseInt(params.page, 10);
        if (page > 1) canonicalParams.set('page', String(page));
    }

    const canonicalPath = canonicalParams.toString()
        ? `/catalog?${canonicalParams.toString()}`
        : '/catalog';
    const canonical = absoluteUrl(canonicalPath);

    return {
        title: 'Catalog | betterstack',
        description: 'View and choose the best software.',
        alternates: { canonical },
        openGraph: {
            url: canonical,
            images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
        },
    };
}

export default async function Catalog({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolvedParams = await searchParams;
    const currentCategorySlug =
        typeof resolvedParams.category === 'string'
            ? resolvedParams.category
            : undefined;
    const currentPage =
        typeof resolvedParams.page === 'string'
            ? parseInt(resolvedParams.page, 10) || 1
            : 1;
    const searchQuery =
        typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
    const currentCatPage =
        typeof resolvedParams.catPage === 'string'
            ? parseInt(resolvedParams.catPage, 10) || 1
            : 1;

    const serverClient = await createServerClient();

    let software: SoftwareListItem[] = [];
    let initialCategories: CategoryListItem[] = [];
    let hasMoreCategories = false;
    let totalPages = 1;
    let categoryIds: number[] | undefined = undefined;
    let categoryNotFound = false;

    try {
        const categoriesRes = await listCategories(serverClient, {
            page: 1,
            perPage: currentCatPage * 5,
        });
        initialCategories = categoriesRes.data ?? [];
        hasMoreCategories =
            currentCatPage * 5 < (categoriesRes.meta?.total ?? 0);

        if (currentCategorySlug) {
            try {
                const activeCategory = await getCategoryBySlug(
                    serverClient,
                    currentCategorySlug,
                );
                if (activeCategory) {
                    categoryIds = [activeCategory.id];
                }
            } catch {
                categoryNotFound = true;
            }
        }

        if (!categoryNotFound) {
            const softwareRes = await listSoftware(serverClient, {
                ...(categoryIds ? { categoryIds } : {}),
                ...(searchQuery ? { q: searchQuery } : {}),
                page: currentPage,
                perPage: 6,
            });
            software = softwareRes.data ?? [];
            totalPages =
                softwareRes.meta?.totalPages ||
                Math.ceil((softwareRes.meta?.total || software.length) / 6) ||
                1;
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Software catalog
                </h1>
                <p className="text-lg text-zinc-400 max-w-2xl">
                    View and choose the best software.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <div className="sticky top-24">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Categories
                        </h2>
                        <CategoryList
                            categories={initialCategories}
                            currentCategorySlug={currentCategorySlug}
                            hasMoreCategories={hasMoreCategories}
                            currentCatPage={currentCatPage}
                            searchParams={resolvedParams}
                        />
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="mb-8">
                        <CatalogSearchBar initialQuery={searchQuery} />
                    </div>

                    {software.length > 0 && !categoryNotFound ? (
                        <>
                            <div className="flex flex-wrap gap-y-6 gap-x-4 md:gap-x-6 lg:gap-x-[16.5px]">
                                {software.map((item) => (
                                    <SoftwareCard key={item.id} item={item} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                searchParams={resolvedParams}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/20">
                            <div className="w-16 h-16 mb-6 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-zinc-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No software found
                            </h3>
                            <p className="text-zinc-400 max-w-md mb-8">
                                {searchQuery
                                    ? `We couldn't find any results for "${searchQuery}".`
                                    : 'There are no tools listed in this category yet.'}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
                                {(currentCategorySlug ||
                                    currentPage > 1 ||
                                    searchQuery) && (
                                    <Link
                                        href="/catalog"
                                        className="w-full sm:w-auto px-6 py-2.5 bg-zinc-100 text-zinc-900 font-medium rounded-xl hover:bg-white transition-colors shadow-lg text-center"
                                    >
                                        Clear filters
                                    </Link>
                                )}
                                <a
                                    href="https://github.com/TeseySTD/betterstack/issues/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-6 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700 text-center"
                                >
                                    Suggest Software
                                </a>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
