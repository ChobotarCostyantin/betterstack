import { redirect } from 'next/navigation';
import {
    getSoftwareBySlug,
    compareSoftware,
} from '@/src/api/software/software.api';
import { createServerClient } from '@/src/lib/api/server.client';
import SoftwareSelector from './_components/SoftwareSelector';
import ComparisonDetails from './_components/ComparisonDetails';
import ComparisonError from './_components/ComparisonError';
import { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/url';
import { SoftwareDetail } from '@/src/api/software/software.schemas';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const { firstSoft, secondSoft } =
        await resolveComparisonSearchParams(searchParams);
    const canonical = getCanonicalUrl(firstSoft, secondSoft);

    const defaultMeta: Metadata = {
        title: 'Software Comparison | betterstack',
        description: 'Compare software tools side-by-side in BetterStack.',
        alternates: { canonical },
    };

    if (!firstSoft && !secondSoft) return defaultMeta;

    const ogUrl = absoluteUrl('/comparison/comparison-og');
    if (firstSoft) ogUrl.searchParams.set('firstSoft', firstSoft);
    if (secondSoft) ogUrl.searchParams.set('secondSoft', secondSoft);

    defaultMeta['openGraph'] = {
        images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    };

    try {
        const serverClient = await createServerClient();

        if (!firstSoft || !secondSoft) {
            const activeSlug = firstSoft || secondSoft;
            const soft = await getSoftwareBySlug(
                serverClient,
                activeSlug!,
            ).catch(() => null);

            return soft
                ? getComparisonMetadataForSingleSoftware(soft)
                : defaultMeta;
        }

        const [soft1, soft2] = await Promise.all([
            getSoftwareBySlug(serverClient, firstSoft).catch(() => null),
            getSoftwareBySlug(serverClient, secondSoft).catch(() => null),
        ]);

        if (!soft1 && !soft2) {
            return defaultMeta;
        }

        if (!soft1 || !soft2) {
            const activeSoft = soft1 || soft2;
            return getComparisonMetadataForSingleSoftware(activeSoft!);
        }

        return {
            ...defaultMeta,
            title: `${soft1.name} vs ${soft2.name} | betterstack`,
            description: `Detailed comparison between ${soft1.name} and ${soft2.name}. Compare pros, cons, and metrics.`,
        };
    } catch {
        return {};
    }
}

async function resolveComparisonSearchParams(
    searchParams: Promise<{ firstSoft?: string; secondSoft?: string }>,
) {
    const resolvedParams = await searchParams;

    const firstSoft =
        typeof resolvedParams?.firstSoft === 'string'
            ? resolvedParams.firstSoft
            : undefined;
    const secondSoft =
        typeof resolvedParams?.secondSoft === 'string'
            ? resolvedParams.secondSoft
            : undefined;

    return { firstSoft, secondSoft };
}

function getComparisonMetadataForSingleSoftware(
    soft: SoftwareDetail,
): Metadata {
    return {
        title: `Compare ${soft.name} | betterstack`,
        description: `Find alternatives and compare ${soft.name} with other software.`,
    };
}

function getCanonicalUrl(first?: string, second?: string): URL {
    const [a, b] = first && second ? [first, second].sort() : [first, second];
    const url = absoluteUrl('/comparison');
    if (a) url.searchParams.set('firstSoft', a);
    if (b) url.searchParams.set('secondSoft', b);
    return url;
}

function getComparisonUrl(first?: string, second?: string): string {
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
    const { firstSoft, secondSoft } =
        await resolveComparisonSearchParams(searchParams);
    const serverClient = await createServerClient();

    if (firstSoft && secondSoft && firstSoft === secondSoft) {
        redirect(getComparisonUrl(firstSoft));
    }

    let comparison = null;
    let software1 = null;
    let software2 = null;
    let hasComparisonError = false;

    if (firstSoft && secondSoft) {
        try {
            comparison = await compareSoftware(
                serverClient,
                firstSoft,
                secondSoft,
            );
            software1 = comparison.softwareA;
            software2 = comparison.softwareB;
        } catch {
            hasComparisonError = true;
            [software1, software2] = await Promise.all([
                getSoftwareBySlug(serverClient, firstSoft).catch(() => null),
                getSoftwareBySlug(serverClient, secondSoft).catch(() => null),
            ]);
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
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Software Comparison
            </h1>

            <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
                    Select Two Software to Compare
                </h2>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <SoftwareSelector
                        title="First Software"
                        // @ts-expect-error Types differ slightly but have required fields
                        selectedSoftware={software1}
                        // @ts-expect-error Types differ slightly but have required fields
                        softwareToCompare={software2}
                        otherSelectedSlug={secondSoft ?? null}
                        onSelect={selectSoftware1}
                        onClear={clearSoftware1}
                    />

                    <SoftwareSelector
                        title="Second Software"
                        // @ts-expect-error Types differ slightly but have required fields
                        selectedSoftware={software2}
                        // @ts-expect-error Types differ slightly but have required fields
                        softwareToCompare={software1}
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
            ) : hasComparisonError ? (
                <ComparisonError />
            ) : comparison ? (
                <ComparisonDetails comparison={comparison} />
            ) : null}
        </div>
    );
}
