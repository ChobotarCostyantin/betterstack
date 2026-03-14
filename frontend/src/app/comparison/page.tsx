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

function getComparisonUrl(first?: string, second?: string) {
    const params = new URLSearchParams();
    if (first) params.set('firstSoft', first);
    if (second) params.set('secondSoft', second);
    const query = params.toString();
    return query ? `/comparison?${query}` : '/comparison';
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const firstSoft =
        typeof resolvedParams?.firstSoft === 'string'
            ? resolvedParams.firstSoft
            : undefined;
    const secondSoft =
        typeof resolvedParams?.secondSoft === 'string'
            ? resolvedParams.secondSoft
            : undefined;

    const ogUrl = new URL(
        '/comparison/comparison-og',
        process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech',
    );
    if (firstSoft) ogUrl.searchParams.set('firstSoft', firstSoft as string);
    if (secondSoft) ogUrl.searchParams.set('secondSoft', secondSoft as string);

    if (!firstSoft && !secondSoft) {
        return {
            title: 'Software Comparison | betterstack',
            description: 'Compare software tools side-by-side in BetterStack.',
        };
    }

    const serverClient = await createServerClient();

    try {
        if (firstSoft && secondSoft) {
            const [soft1, soft2] = await Promise.all([
                getSoftwareBySlug(serverClient, firstSoft).catch(() => null),
                getSoftwareBySlug(serverClient, secondSoft).catch(() => null),
            ]);

            if (soft1 && soft2) {
                return {
                    title: `${soft1.name} vs ${soft2.name} | betterstack`,
                    description: `Detailed comparison between ${soft1.name} and ${soft2.name}. Compare pros, cons, and metrics.`,
                    openGraph: {
                        images: [
                            {
                                url: ogUrl.toString(),
                                width: 1200,
                                height: 630,
                            },
                        ],
                    },
                };
            }
        }

        const activeSlug = firstSoft || secondSoft;
        if (activeSlug) {
            const soft = await getSoftwareBySlug(
                serverClient,
                activeSlug,
            ).catch(() => null);
            if (soft) {
                return {
                    title: `Compare ${soft.name} | betterstack`,
                    description: `Find alternatives and compare ${soft.name} with other software.`,
                    openGraph: {
                        images: [
                            {
                                url: ogUrl.toString(),
                                width: 1200,
                                height: 630,
                            },
                        ],
                    },
                };
            }
        }
    } catch {
        return {
            title: 'Comparison | betterstack',
            description: 'Compare software in BetterStack',
        };
    }

    return {
        title: 'Comparison | betterstack',
        description: 'Compare software in BetterStack',
        openGraph: {
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
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
        } catch (error) {
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
