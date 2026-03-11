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

export const metadata: Metadata = {
    title: 'Catalog | betterstack',
    description: 'View and choose the best software.',
};

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

    const serverClient = await createServerClient();

    let software: SoftwareListItem[] = [];
    let initialCategories: CategoryListItem[] = [];
    let initialCategoriesTotalPages = 1;
    let totalPages = 1;
    let categoryIds: number[] | undefined = undefined;
    let categoryNotFound = false;

    try {
        const categoriesRes = await listCategories(serverClient, {
            page: 1,
            perPage: 3,
        });
        initialCategories = categoriesRes.data ?? [];
        initialCategoriesTotalPages = categoriesRes.meta?.totalPages || 1;

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
                            initialCategories={initialCategories}
                            currentCategorySlug={currentCategorySlug}
                            totalPages={initialCategoriesTotalPages}
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
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/20">
                            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-zinc-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Nothing found.
                            </h3>
                            <p className="text-zinc-400 max-w-md">
                                {searchQuery
                                    ? `No software found for "${searchQuery}".`
                                    : 'No software found for the selected category or page.'}
                            </p>
                            {(currentCategorySlug ||
                                currentPage > 1 ||
                                searchQuery) && (
                                <Link
                                    href="/catalog"
                                    className="mt-6 px-6 py-2.5 bg-zinc-100 text-zinc-900 font-medium rounded-xl hover:bg-white transition-colors shadow-lg"
                                >
                                    Clear filters
                                </Link>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
