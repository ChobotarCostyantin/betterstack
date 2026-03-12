import { redirect } from 'next/navigation';
import {
    getSoftwareBySlug,
    compareSoftware,
} from '@/src/api/software/software.api';
import { createServerClient } from '@/src/lib/api/server.client';
import SoftwareSelector from './_components/SoftwareSelector';
import ComparisonDetails from './_components/ComparisonDetails';

function getComparisonUrl(first?: string, second?: string) {
    const params = new URLSearchParams();
    if (first) params.set('firstSoft', first);
    if (second) params.set('secondSoft', second);
    const query = params.toString();
    return query ? `/comparison?${query}` : '/comparison';
}

export default async function Comparison({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const firstSoft =
        typeof resolvedParams?.firstSoft === 'string'
            ? resolvedParams.firstSoft
            : undefined;
    const secondSoft =
        typeof resolvedParams?.secondSoft === 'string'
            ? resolvedParams.secondSoft
            : undefined;
    const serverClient = await createServerClient();

    if (firstSoft && secondSoft && firstSoft === secondSoft) {
        redirect(getComparisonUrl(firstSoft));
    }

    let comparison = null;
    let software1 = null;
    let software2 = null;

    if (firstSoft && secondSoft) {
        comparison = await compareSoftware(
            serverClient,
            firstSoft,
            secondSoft,
        ).catch(() => null);
        if (comparison) {
            software1 = comparison.softwareA;
            software2 = comparison.softwareB;
        }
    } else {
        [software1, software2] = await Promise.all([
            firstSoft
                ? getSoftwareBySlug(serverClient, firstSoft).catch(() => null)
                : Promise.resolve(null),
            secondSoft
                ? getSoftwareBySlug(serverClient, secondSoft).catch(() => null)
                : Promise.resolve(null),
        ]);
    }

    const selectSoftware1 = async (slug: string) => {
        'use server';
        redirect(getComparisonUrl(slug, secondSoft));
    };

    const selectSoftware2 = async (slug: string) => {
        'use server';
        redirect(getComparisonUrl(firstSoft, slug));
    };

    const clearSoftware1 = async () => {
        'use server';
        redirect(getComparisonUrl(undefined, secondSoft));
    };

    const clearSoftware2 = async () => {
        'use server';
        redirect(getComparisonUrl(firstSoft, undefined));
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">
                Software Comparison
            </h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                    Select Two Software to Compare
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <SoftwareSelector
                        title="First Software"
                        // @ts-expect-error Types differ slightly but have required fields
                        selectedSoftware={software1}
                        otherSelectedSlug={secondSoft ?? null}
                        onSelect={selectSoftware1}
                        onClear={clearSoftware1}
                    />

                    <SoftwareSelector
                        title="Second Software"
                        // @ts-expect-error Types differ slightly but have required fields
                        selectedSoftware={software2}
                        otherSelectedSlug={firstSoft ?? null}
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
