'use client';

import { CategoryListItem } from '@/src/api/categories/categories.schemas';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({
    categories,
    currentCategory,
}: {
    categories: CategoryListItem[];
    currentCategory?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryClick = (slug?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }

        params.delete('page');

        const newUrl = params.toString()
            ? `/catalog?${params.toString()}`
            : '/catalog';
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
                onClick={() => handleCategoryClick()}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    !currentCategory
                        ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                }`}
            >
                All software
            </button>
            {categories.map((category) => {
                const isActive = currentCategory === category.slug;
                return (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
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
    );
}
