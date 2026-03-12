'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Software, Criterion } from '@/src/lib/types';
import { getCriteriaAction, getSoftwareBySlug } from '@/src/lib/api';
import SoftwareSelector from './_components/SoftwareSelector';

export default function ComparisonPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [software1, setSoftware1] = useState<Software | null>(null);
    const [software2, setSoftware2] = useState<Software | null>(null);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
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

    const selectSoftware1 = (software: Software) => {
        // Prevent selecting the same software twice
        if (software2 && software.slug === software2.slug) {
            return;
        }
        
        setSoftware1(software);
        
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
                    <SoftwareSelector
                        title="First Software"
                        selectedSoftware={software1}
                        otherSelectedSoftware={software2}
                        criteria={criteria}
                        onSelect={selectSoftware1}
                        onClear={clearSoftware1}
                    />

                    {/* Software 2 Selection */}
                    <SoftwareSelector
                        title="Second Software"
                        selectedSoftware={software2}
                        otherSelectedSoftware={software1}
                        criteria={criteria}
                        onSelect={selectSoftware2}
                        onClear={clearSoftware2}
                    />
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