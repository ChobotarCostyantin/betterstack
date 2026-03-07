'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Software, Criterion } from '@/src/lib/types';
import { searchAction, getCriteriaAction, getSoftwareBySlug } from '@/src/lib/api';

export default function ComparisonPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [software1, setSoftware1] = useState<Software | null>(null);
    const [software2, setSoftware2] = useState<Software | null>(null);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [searchQuery1, setSearchQuery1] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchResults1, setSearchResults1] = useState<Software[]>([]);
    const [searchResults2, setSearchResults2] = useState<Software[]>([]);
    const [isSearching1, setIsSearching1] = useState(false);
    const [isSearching2, setIsSearching2] = useState(false);
    const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);

    useEffect(() => {
        const fetchCriteria = async () => {
            try {
                const data = await getCriteriaAction();
                setCriteria(data);
            } catch (error) {
                console.error('Failed to fetch criteria:', error);
            }
        };
        fetchCriteria();
    }, []);

    // Handle URL parameters for auto-population
    useEffect(() => {
        const firstSoft = searchParams.get('firstSoft');
        const secondSoft = searchParams.get('secondSoft');

        // If both parameters are the same, clear URL and show empty comparison
        if (firstSoft && secondSoft && firstSoft === secondSoft) {
            router.replace('/comparison', { scroll: false });
            setSoftware1(null);
            setSoftware2(null);
            return;
        }

        if (firstSoft || secondSoft) {
            setIsLoadingFromUrl(true);
            const loadSoftwareFromUrl = async () => {
                try {
                    if (firstSoft) {
                        const software = await getSoftwareBySlug(firstSoft);
                        if (software) {
                            setSoftware1(software);
                        }
                    }
                    if (secondSoft) {
                        const software = await getSoftwareBySlug(secondSoft);
                        if (software) {
                            setSoftware2(software);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load software from URL:', error);
                } finally {
                    setIsLoadingFromUrl(false);
                }
            };
            loadSoftwareFromUrl();
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (searchQuery1.trim().length < 2) {
            setSearchResults1([]);
            return;
        }

        const fetchResults = async () => {
            setIsSearching1(true);
            try {
                const data = await searchAction(searchQuery1);
                setSearchResults1(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching1(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery1]);

    useEffect(() => {
        if (searchQuery2.trim().length < 2) {
            setSearchResults2([]);
            return;
        }

        const fetchResults = async () => {
            setIsSearching2(true);
            try {
                const data = await searchAction(searchQuery2);
                setSearchResults2(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching2(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery2]);

    const selectSoftware1 = (software: Software) => {
        // Prevent selecting the same software twice
        if (software2 && software.slug === software2.slug) {
            return;
        }
        
        setSoftware1(software);
        setSearchQuery1('');
        setSearchResults1([]);
        
        // Update URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.set('firstSoft', software.slug);
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const selectSoftware2 = (software: Software) => {
        // Prevent selecting the same software twice
        if (software1 && software.slug === software1.slug) {
            return;
        }
        
        setSoftware2(software);
        setSearchQuery2('');
        setSearchResults2([]);
        
        // Update URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.set('secondSoft', software.slug);
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const clearSoftware1 = () => {
        setSoftware1(null);
        
        // Update URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.delete('firstSoft');
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const clearSoftware2 = () => {
        setSoftware2(null);
        
        // Update URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.delete('secondSoft');
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const getFeatureValue = (software: Software, criterionId: number) => {
        const value = software.features[criterionId];
        if (value === undefined || value === null) return 'N/A';
        
        const criterion = criteria.find(c => c.id === criterionId);
        if (!criterion) return value;
        
        switch (criterion.type) {
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'rating':
                return typeof value === 'number' ? `${value}/5` : value;
            case 'currency':
                return typeof value === 'number' ? `$${value}` : value;
            default:
                return value;
        }
    };

    const getRawFeatureValue = (software: Software, criterionId: number) => {
        return software.features[criterionId];
    };

    const getWinner = (criterion: Criterion, softwareA: Software, softwareB: Software) => {
        const valueA = getRawFeatureValue(softwareA, criterion.id);
        const valueB = getRawFeatureValue(softwareB, criterion.id);
        
        if (valueA === undefined || valueA === null || valueB === undefined || valueB === null) return null;
        
        switch (criterion.type) {
            case 'rating':
                // Higher rating is better
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    if (valueA > valueB) return 0; // softwareA wins
                    if (valueA < valueB) return 1; // softwareB wins
                    return 2; // tie
                }
                break;
            case 'boolean':
                // True is better
                if (valueA === true && valueB !== true) return 0;
                if (valueB === true && valueA !== true) return 1;
                if (valueA === valueB) return 2; // both true or both false
                break;
            case 'currency':
                // Lower cost is better
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    if (valueA < valueB) return 0; // softwareA wins (lower cost)
                    if (valueA > valueB) return 1; // softwareB wins (lower cost)
                    return 2; // same cost
                }
                break;
        }
        return null; // No comparison possible
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Software Comparison</h1>
            
            {isLoadingFromUrl && (
                <div className="mb-4 text-center text-zinc-400">
                    Loading comparison from URL...
                </div>
            )}
            
            {/* Software selection section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Select Two Software to Compare</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Software 1 Selection */}
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-medium mb-4 text-white">First Software</h3>
                        {software1 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        {software1.logoUrl && (
                                            <Image
                                                src={software1.logoUrl}
                                                alt={`${software1.name} logo`}
                                                width={40}
                                                height={40}
                                                className="rounded object-contain"
                                            />
                                        )}
                                        <div>
                                            {software1.websiteUrl ? (
                                                <a
                                                    href={software1.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-white hover:text-zinc-300 transition-colors"
                                                >
                                                    {software1.name}
                                                </a>
                                            ) : (
                                                <div className="font-medium text-white">{software1.name}</div>
                                            )}
                                            <div className="text-sm text-zinc-400">{software1.shortDescription}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearSoftware1}
                                        className="text-zinc-400 hover:text-zinc-200 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {software2 && criteria.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Comparison Details:</h4>
                                        {criteria.map((criterion) => {
                                            const winner = getWinner(criterion, software1, software2);
                                            return (
                                                <div key={criterion.id} className={`flex justify-between items-center py-2 px-3 rounded transition-colors ${
                                                    winner === 0
                                                        ? 'bg-emerald-900/30 text-emerald-200 font-bold' // Winner: whole row green background, bold text
                                                        : winner === 1
                                                        ? 'bg-red-900/20 text-red-200' // Loser: slight red background
                                                        : winner === 2
                                                        ? 'bg-yellow-900/20 text-yellow-200 font-bold' // Tie: light yellow background, bold text
                                                        : 'bg-zinc-800/50 text-zinc-300' // No comparison
                                                }`}>
                                                    <span className="text-sm">{criterion.name}</span>
                                                    <span className="text-sm">
                                                        {getFeatureValue(software1, criterion.id)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery1}
                                    onChange={(e) => setSearchQuery1(e.target.value)}
                                    placeholder="Search for software..."
                                    className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
                                />
                                {isSearching1 && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-400"></div>
                                    </div>
                                )}
                                {searchResults1.length > 0 && (
                                    <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-2xl">
                                        {searchResults1
                                            .filter(software => !software2 || software.id !== software2.id) // Hide if already selected in second window
                                            .map((software) => (
                                            <div
                                                key={software.id}
                                                onClick={() => selectSoftware1(software)}
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

                    {/* Software 2 Selection */}
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-medium mb-4 text-white">Second Software</h3>
                        {software2 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        {software2.logoUrl && (
                                            <Image
                                                src={software2.logoUrl}
                                                alt={`${software2.name} logo`}
                                                width={40}
                                                height={40}
                                                className="rounded object-contain"
                                            />
                                        )}
                                        <div>
                                            {software2.websiteUrl ? (
                                                <a
                                                    href={software2.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-white hover:text-zinc-300 transition-colors"
                                                >
                                                    {software2.name}
                                                </a>
                                            ) : (
                                                <div className="font-medium text-white">{software2.name}</div>
                                            )}
                                            <div className="text-sm text-zinc-400">{software2.shortDescription}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearSoftware2}
                                        className="text-zinc-400 hover:text-zinc-200 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {software1 && criteria.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Comparison Details:</h4>
                                        {criteria.map((criterion) => {
                                            const winner = getWinner(criterion, software1, software2);
                                            return (
                                                <div key={criterion.id} className={`flex justify-between items-center py-2 px-3 rounded transition-colors ${
                                                    winner === 1
                                                        ? 'bg-emerald-900/30 text-emerald-200 font-bold' // Winner: whole row green background, bold text
                                                        : winner === 0
                                                        ? 'bg-red-900/20 text-red-200' // Loser: slight red background
                                                        : winner === 2
                                                        ? 'bg-yellow-900/20 text-yellow-200 font-bold' // Tie: light yellow background, bold text
                                                        : 'bg-zinc-800/50 text-zinc-300' // No comparison
                                                }`}>
                                                    <span className="text-sm">{criterion.name}</span>
                                                    <span className="text-sm">
                                                        {getFeatureValue(software2, criterion.id)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery2}
                                    onChange={(e) => setSearchQuery2(e.target.value)}
                                    placeholder="Search for software..."
                                    className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-colors"
                                />
                                {isSearching2 && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-400"></div>
                                    </div>
                                )}
                                {searchResults2.length > 0 && (
                                    <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-2xl">
                                        {searchResults2
                                            .filter(software => !software1 || software.id !== software1.id) // Hide if already selected in first window
                                            .map((software) => (
                                            <div
                                                key={software.id}
                                                onClick={() => selectSoftware2(software)}
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
                </div>
            </div>

            {(!software1 || !software2) && (
                <div className="text-center text-zinc-500 mt-8">
                    Select both software to start comparing
                </div>
            )}
        </div>
    );
}