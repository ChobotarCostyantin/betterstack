'use client';

import { useState, useEffect, useRef } from 'react';
import { searchAction, getCategoryByIdAction } from '@/src/lib/api';
import { Software } from '@/src/lib/types';
import SearchResultItem from './SearchResultItem';

export default function LiveSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Software[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMissingCategories = async () => {
            const allCategoryIds = Array.from(
                new Set(results.flatMap((item) => item.categoryIds || [])),
            );

            const missingIds = allCategoryIds.filter(
                (id) => !categoryNames[id],
            );

            if (missingIds.length === 0) return;

            const newNames: Record<number, string> = { ...categoryNames };

            await Promise.all(
                missingIds.map(async (id) => {
                    try {
                        const category = await getCategoryByIdAction(id);
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
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
            <div className="relative group">
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-100">
                    {results.length === 0 && !isLoading ? (
                        <div className="p-6 text-center text-zinc-500">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {results.map((result) => (
                                <SearchResultItem 
                                    key={result.id} 
                                    result={result} 
                                    categoryNames={categoryNames} 
                                    onClose={() => setIsOpen(false)} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}