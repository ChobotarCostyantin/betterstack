'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchAction } from '@/src/lib/api';
import { Software } from '@/src/lib/types';

const CATEGORY_MAP: Record<number, string> = {
    1: 'Frameworks',
    2: 'Databases',
    3: 'CSS Tools',
    4: 'Languages',
};

export default function LiveSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Software[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

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
                console.error('Помилка пошуку:', error);
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
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                >
                                    {/* <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                        {result.type === 'software' ? '📦' : '📂'}
                                    </div> */}
                                    <div className="flex flex-col">
                                        <span className="text-zinc-200 font-medium flex items-center gap-2">
                                            {result.name}
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                                                {result.categoryIds
                                                    .map(
                                                        (id) =>
                                                            CATEGORY_MAP[id] ||
                                                            `Cat ${id}`,
                                                    )
                                                    .join(', ')}
                                            </span>
                                        </span>
                                        {result.type === 'software' && (
                                            <span className="text-sm text-zinc-500 truncate">
                                                {result.shortDescription}
                                            </span>
                                        )}
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
