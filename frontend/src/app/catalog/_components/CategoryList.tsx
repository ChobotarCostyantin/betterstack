'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryListItem } from '@/src/api/categories/categories.schemas';
import { listCategories } from '@/src/api/categories/categories.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { Loader2 } from 'lucide-react';

export default function CategoryList({
    initialCategories,
    currentCategorySlug,
    totalPages,
}: {
    initialCategories: CategoryListItem[];
    currentCategorySlug?: string;
    totalPages: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] =
        useState<CategoryListItem[]>(initialCategories);
    const [nextPage, setNextPage] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(totalPages > 1);

    useEffect(() => {
        setCategories(initialCategories);
        setNextPage(2);
        setHasMore(totalPages > 1);
    }, [initialCategories, totalPages]);

    const handleLoadMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const res = await listCategories(browserClient, {
                page: nextPage,
                perPage: 5,
            });

            if (res.data && res.data.length > 0) {
                setCategories((prev) => {
                    const newCats = res.data!.filter(
                        (newCat) => !prev.some((pCat) => pCat.id === newCat.id),
                    );
                    return [...prev, ...newCats];
                });

                const newNextPage = nextPage + 1;
                setNextPage(newNextPage);
                setHasMore(newNextPage <= (res.meta?.totalPages || 1));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryClick = (slug?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }

        // Always reset to page 1 for software when changing categories
        params.delete('page');

        const newUrl = params.toString()
            ? `/catalog?${params.toString()}`
            : '/catalog';
        router.push(newUrl, { scroll: true });
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 max-h-50 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900/50 hover:scrollbar-thumb-zinc-600 transition-colors">
                <button
                    onClick={() => handleCategoryClick()}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left shrink-0 ${
                        !currentCategorySlug
                            ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                    }`}
                >
                    All software
                </button>

                {categories.map((category) => {
                    const isActive = currentCategorySlug === category.slug;

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.slug)}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left shrink-0 ${
                                isActive
                                    ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                            }`}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1 lg:mt-0"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        'Load more'
                    )}
                </button>
            )}
        </div>
    );
}
