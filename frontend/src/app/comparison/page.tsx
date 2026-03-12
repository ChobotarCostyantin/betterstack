'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    getSoftwareBySlug,
    compareSoftware,
} from '@/src/api/software/software.api';
import type {
    SoftwareDetail,
    SoftwareComparison,
} from '@/src/api/software/software.schemas';
import { browserClient } from '@/src/lib/api/browser.client';
import SoftwareSelector from './_components/SoftwareSelector';
import ComparisonDetails from './_components/ComparisonDetails';

export default function ComparisonPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [software1, setSoftware1] = useState<SoftwareDetail | null>(null);
    const [software2, setSoftware2] = useState<SoftwareDetail | null>(null);
    const [comparison, setComparison] = useState<SoftwareComparison | null>(
        null,
    );
    const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);

    const firstSoft = searchParams.get('firstSoft');
    const secondSoft = searchParams.get('secondSoft');

    useEffect(() => {
        if (firstSoft && secondSoft && firstSoft === secondSoft) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('secondSoft');
            router.replace(`/comparison?${params.toString()}`, {
                scroll: false,
            });
            return;
        }

        const loadData = async () => {
            setIsLoadingFromUrl(true);
            try {
                if (firstSoft && (!software1 || software1.slug !== firstSoft)) {
                    const s1 = await getSoftwareBySlug(
                        browserClient,
                        firstSoft,
                    );
                    setSoftware1(s1);
                } else if (!firstSoft) {
                    setSoftware1(null);
                }

                if (
                    secondSoft &&
                    (!software2 || software2.slug !== secondSoft)
                ) {
                    const s2 = await getSoftwareBySlug(
                        browserClient,
                        secondSoft,
                    );
                    setSoftware2(s2);
                } else if (!secondSoft) {
                    setSoftware2(null);
                }

                if (firstSoft && secondSoft) {
                    const comp = await compareSoftware(
                        browserClient,
                        firstSoft,
                        secondSoft,
                    );
                    setComparison(comp);
                } else {
                    setComparison(null);
                }
            } catch (error) {
                console.error('Failed to load comparison data:', error);
            } finally {
                setIsLoadingFromUrl(false);
            }
        };

        loadData();
    }, [firstSoft, secondSoft, searchParams, router]);

    const selectSoftware1 = (slug: string) => {
        if (secondSoft === slug) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('firstSoft', slug);
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const selectSoftware2 = (slug: string) => {
        if (firstSoft === slug) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('secondSoft', slug);
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const clearSoftware1 = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('firstSoft');
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    const clearSoftware2 = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('secondSoft');
        router.replace(`/comparison?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">
                Software Comparison
            </h1>

            {isLoadingFromUrl && (
                <div className="mb-4 text-center text-zinc-400">
                    Loading comparison data...
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                    Select Two Software to Compare
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <SoftwareSelector
                        title="First Software"
                        selectedSoftware={software1}
                        otherSelectedSlug={secondSoft}
                        onSelect={selectSoftware1}
                        onClear={clearSoftware1}
                    />

                    <SoftwareSelector
                        title="Second Software"
                        selectedSoftware={software2}
                        otherSelectedSlug={firstSoft}
                        onSelect={selectSoftware2}
                        onClear={clearSoftware2}
                    />
                </div>
            </div>

            {!firstSoft || !secondSoft ? (
                <div className="text-center text-zinc-500 mt-8">
                    Select both software to see the comparison
                </div>
            ) : comparison ? (
                <ComparisonDetails comparison={comparison} />
            ) : null}
        </div>
    );
}
