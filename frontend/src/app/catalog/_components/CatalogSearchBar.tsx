'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function CatalogSearchBar({
    initialQuery = '',
}: {
    initialQuery?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        if (query === initialQuery) return;

        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (query.trim()) {
                params.set('q', query.trim());
            } else {
                params.delete('q');
            }

            params.delete('page');

            const newUrl = params.toString()
                ? `/catalog?${params.toString()}`
                : '/catalog';
            router.push(newUrl, { scroll: false });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, router, searchParams, initialQuery]);

    const handleClear = () => {
        setQuery('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        params.delete('page');
        const newUrl = params.toString()
            ? `/catalog?${params.toString()}`
            : '/catalog';
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            </div>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search software..."
                className="w-full pl-12 pr-12 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-[#111114] transition-all shadow-sm"
            />

            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
