'use client';

import { useState, useEffect, useRef } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';
import { browserClient } from '@/src/lib/api/browser.client';
import { listSoftware } from '@/src/api/software/software.api';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';
import SearchResultItem from './SearchResultItem';
import { Search } from 'lucide-react';

export default function LiveSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SoftwareListItem[]>([]);
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
                const data = await listSoftware(browserClient, { q: query });
                setResults(data.data);
                if (data.data.length) {
                    sendGTMEvent({
                        event: 'view_search_results',
                        search_term: query,
                        results_count: data.data.length,
                    });
                }
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-5">
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="z-5 w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    placeholder="Search software or frameworks..."
                    className="w-full pl-12 pr-6 py-4 bg-[#111114]/80 border border-zinc-800 rounded-2xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all backdrop-blur-md shadow-lg"
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
                            No results found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {results.map((result) => (
                                <SearchResultItem
                                    key={result.id}
                                    result={result}
                                    onCloseAction={() => setIsOpen(false)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
