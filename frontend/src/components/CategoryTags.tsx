'use client';

import CategoryPopup from '@/src/app/home/_components/CategoryPopup';

interface CategoryTagsProps {
    categories?: string[] | null;
    maxDisplay?: number;
    showAll?: boolean;
}

export default function CategoryTags({
    categories,
    maxDisplay = 1,
    showAll = false,
}: CategoryTagsProps) {
    if (!categories || categories.length === 0) return null;

    const displayCategories = showAll
        ? categories
        : categories.slice(0, maxDisplay);

    return (
        <div className="flex flex-wrap gap-1.5 items-center shrink-0">
            {displayCategories.map((name) => (
                <span
                    key={name}
                    title={name}
                    className={`text-[11px] px-3 py-1 rounded-lg bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 uppercase font-semibold transition-all ${
                        showAll ? '' : 'max-w-30 truncate'
                    }`}
                >
                    {name}
                </span>
            ))}
            {!showAll && categories.length > maxDisplay && (
                <CategoryPopup
                    categories={categories}
                    maxDisplay={maxDisplay}
                />
            )}
        </div>
    );
}
