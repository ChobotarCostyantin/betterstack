'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Software, Criterion } from '@/src/lib/types';
import { searchAction } from '@/src/lib/api';
import ComparisonDetails from './ComparisonDetails';

interface SoftwareSelectorProps {
    title: string;
    selectedSoftware: Software | null;
    otherSelectedSoftware: Software | null;
    criteria: Criterion[];
    onSelect: (software: Software) => void;
    onClear: () => void;
}

export default function SoftwareSelector({
    title,
    selectedSoftware,
    otherSelectedSoftware,
    criteria,
    onSelect,
    onClear
}: SoftwareSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Software[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsSearching(true);
            try {
                const data = await searchAction(searchQuery);
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-white">{title}</h3>
            {selectedSoftware ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            {selectedSoftware.logoUrl && (
                                <Image
                                    src={selectedSoftware.logoUrl}
                                    alt={`${selectedSoftware.name} logo`}
                                    width={40}
                                    height={40}
                                    className="rounded object-contain"
                                />
                            )}
                            <div>
                                {selectedSoftware.websiteUrl ? (
                                    <a
                                        href={selectedSoftware.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-white hover:text-zinc-300 transition-colors"
                                    >
                                        {selectedSoftware.name}
                                    </a>
                                ) : (
                                    <div className="font-medium text-white">{selectedSoftware.name}</div>
                                )}
                                <div className="text-sm text-zinc-400">{selectedSoftware.shortDescription}</div>
                            </div>
                        </div>
                        <button
                            onClick={onClear}
                            className="text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    {otherSelectedSoftware && criteria.length > 0 && (
                        <ComparisonDetails
                            software={selectedSoftware}
                            otherSoftware={otherSelectedSoftware}
                            criteria={criteria}
                        />
                    )}
                </div>
            ) : (
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for software..."
                        className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-400"></div>
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-2xl">
                            {searchResults
                                .filter(software => !otherSelectedSoftware || software.id !== otherSelectedSoftware.id)
                                .map((software) => (
                                <div
                                    key={software.id}
                                    onClick={() => onSelect(software)}
                                    className="p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-b-0 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        {software.logoUrl && (
                                            <Image
                                                src={software.logoUrl}
                                                alt={`${software.name} logo`}
                                                width={32}
                                                height={32}
                                                className="rounded object-contain"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium text-white">{software.name}</div>
                                            <div className="text-sm text-zinc-400">{software.shortDescription}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}