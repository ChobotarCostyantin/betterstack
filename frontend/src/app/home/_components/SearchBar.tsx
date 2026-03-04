'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchAction, getCategoryByIdAction } from '@/src/lib/api';
import { Software } from '@/src/lib/types';

export default function LiveSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Software[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryNames, setCategoryNames] = useState<Record<number, string>>(
        {},
    );

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMissingCategories = async () => {
            const allCategoryIds = Array.from(
                new Set(results.flatMap((item) => item.categoryIds)),
            );

            const missingIds = allCategoryIds.filter(
                (id) => !categoryNames[id],
            );

            if (missingIds.length === 0) return;

            const newNames: Record<number, string> = { ...categoryNames };

            await Promise.all(
                missingIds.map(async (id) => {
                    try {
                        const category = await getCategoryByIdAction(id); //
                        if (category && category.name) {
                            newNames[id] = category.name;
                        }
                    } catch (error) {
                        console.error(`Error fetching category ${id}:`, error);
                        newNames[id] = `Unknown #${id}`;
                    }
                }),
            );

            setCategoryNames(newNames);
        };

        if (results.length > 0) {
            fetchMissingCategories();
        }
    }, [results]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setIsOpen(true);

            try {
                const data = await searchAction(query);
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
            <div className="relative group z-50">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    placeholder="Search software, frameworks, or categories..."
                    className="w-full px-6 py-4 bg-[#111114]/80 border border-zinc-800 rounded-2xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all backdrop-blur-md shadow-lg"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col max-h-100">
                    {results.length === 0 && !isLoading ? (
                        <div className="p-6 text-center text-zinc-500">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="overflow-y-auto p-2">
                            {results.map((result) => (
                                <Link
                                    href={`/article/${result.id}`}
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-zinc-800 transition-colors group"
                                >
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-zinc-200 font-medium truncate">
                                            {result.name}
                                        </span>
                                        {result.type === 'software' && (
                                            <span className="text-sm text-zinc-500 truncate">
                                                {result.shortDescription}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-1">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase whitespace-nowrap">
                                            {result.categoryIds
                                                .map(
                                                    (id) =>
                                                        categoryNames[id] ||
                                                        `Loading...`,
                                                )
                                                .join(', ')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
