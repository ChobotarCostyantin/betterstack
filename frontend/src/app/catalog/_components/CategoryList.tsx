import Link from 'next/link';
import { CategoryListItem } from '@/src/api/categories/categories.schemas';

function buildUrl(
    params: Record<string, string | string[] | undefined>,
    overrides: Record<string, string | null>,
): string {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (typeof v === 'string') p.set(k, v);
    }
    for (const [k, v] of Object.entries(overrides)) {
        if (v === null) p.delete(k);
        else p.set(k, v);
    }
    const str = p.toString();
    return str ? `/catalog?${str}` : '/catalog';
}

export default function CategoryList({
    categories,
    currentCategorySlug,
    hasMoreCategories,
    currentCatPage,
    searchParams,
}: {
    categories: CategoryListItem[];
    currentCategorySlug?: string;
    hasMoreCategories: boolean;
    currentCatPage: number;
    searchParams: Record<string, string | string[] | undefined>;
}) {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 max-h-50 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900/50 hover:scrollbar-thumb-zinc-600 transition-colors">
                <Link
                    href={buildUrl(searchParams, {
                        category: null,
                        page: null,
                    })}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left shrink-0 ${
                        !currentCategorySlug
                            ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                    }`}
                >
                    All software
                </Link>

                {categories.map((category) => {
                    const isActive = currentCategorySlug === category.slug;

                    return (
                        <Link
                            key={category.id}
                            href={buildUrl(searchParams, {
                                category: category.slug,
                                page: null,
                            })}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left shrink-0 ${
                                isActive
                                    ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                            }`}
                        >
                            {category.name}
                        </Link>
                    );
                })}
            </div>

            {hasMoreCategories && (
                <Link
                    href={buildUrl(searchParams, {
                        catPage: String(currentCatPage + 1),
                    })}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors mt-1 lg:mt-0"
                >
                    Load more
                </Link>
            )}
        </div>
    );
}
