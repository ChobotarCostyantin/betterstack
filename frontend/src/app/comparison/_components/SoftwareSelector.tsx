'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    getSoftwareAlternatives,
    listSoftware,
} from '@/src/api/software/software.api';
import type {
    SoftwareListItem,
    SoftwareDetail,
} from '@/src/api/software/software.schemas';
import { browserClient } from '@/src/lib/api/browser.client';
import { Search, X } from 'lucide-react';
import SelectorResultItem from './SelectorResultItem';
import Link from 'next/link';

interface SoftwareSelectorProps {
    title: string;
    selectedSoftware: SoftwareDetail | null;
    childSoftware: SoftwareDetail | null;
    otherSelectedSlug: string | null;
    onSelect: (slug: string) => void;
    onClear: () => void;
}

export default function SoftwareSelector({
    title,
    selectedSoftware,
    childSoftware,
    otherSelectedSlug,
    onSelect,
    onClear,
}: SoftwareSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SoftwareListItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setIsOpen(false);
            return;
        }

        const fetchResults = async () => {
            setIsSearching(true);
            setIsOpen(true);
            try {
                let response;
                if (childSoftware)
                    // Search among alternatives
                    response = await getSoftwareAlternatives(
                        browserClient,
                        childSoftware.slug,
                        {
                            q: searchQuery,
                        },
                    );
                else {
                    response = await listSoftware(browserClient, {
                        q: searchQuery,
                    });
                }

                const items = response.data ?? [];
                setSearchResults(Array.isArray(items) ? items : []);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <div className="flex flex-col w-full min-w-0">
            <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4 text-white">
                {title}
            </h3>
            {selectedSoftware ? (
                <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-[#111114]/80 border border-zinc-800 rounded-2xl shadow-lg backdrop-blur-md w-full">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        {selectedSoftware.logoUrl && (
                            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-900 flex items-center justify-center">
                                <Image
                                    unoptimized
                                    src={selectedSoftware.logoUrl}
                                    alt={`${selectedSoftware.name} logo`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-col flex-1 min-w-0">
                            <Link
                                href={`/article/${selectedSoftware.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-base md:text-lg text-white hover:text-zinc-300 transition-colors truncate"
                            >
                                {selectedSoftware.name}
                            </Link>

                            <div className="text-xs md:text-sm text-zinc-400 truncate">
                                {selectedSoftware.shortDescription}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="ml-2 md:ml-4 p-1.5 md:p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all shrink-0"
                        aria-label="Clear selection"
                    >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            ) : (
                <div ref={wrapperRef} className="relative w-full min-w-0">
                    <div className="relative group w-full">
                        <div className="absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none">
                            <Search className="z-10 w-4 h-4 md:w-5 md:h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() =>
                                searchQuery.trim().length >= 2 &&
                                setIsOpen(true)
                            }
                            placeholder="Search software..."
                            className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 bg-[#111114]/80 border border-zinc-800 rounded-2xl text-base text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all backdrop-blur-md shadow-lg"
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {isOpen && searchQuery.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-60 md:max-h-80 z-50 overflow-hidden">
                            {searchResults.length === 0 && !isSearching ? (
                                <div className="p-4 md:p-6 text-center text-sm md:text-base text-zinc-500 wrap-break-word">
                                    No results found for &quot;{searchQuery}
                                    &quot;
                                </div>
                            ) : (
                                <div className="overflow-y-auto p-1.5 md:p-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                                    {searchResults
                                        .filter(
                                            (software) =>
                                                software.slug !==
                                                otherSelectedSlug,
                                        )
                                        .map((software) => (
                                            <SelectorResultItem
                                                key={software.id}
                                                software={software}
                                                onSelect={onSelect}
                                                onCloseAction={() =>
                                                    setIsOpen(false)
                                                }
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
