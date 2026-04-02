'use client';

import Image from 'next/image';
import type {
    SoftwareComparison,
    SoftwareComparisonSide,
} from '@/src/api/software/software.schemas';
import FactorBox from './FactorBox';

interface ComparisonDetailsProps {
    comparison: SoftwareComparison;
}

function SoftwareColumnHeader({
    software,
}: {
    software: SoftwareComparisonSide;
}) {
    return (
        <div className="flex flex-row items-center justify-center gap-2.5 w-full px-2">
            {software.logoUrl ? (
                <div className="relative w-6 h-6 md:w-7 md:h-7 shrink-0">
                    <Image
                        unoptimized
                        src={software.logoUrl}
                        alt={`${software.name} logo`}
                        fill
                        className="object-contain"
                    />
                </div>
            ) : (
                <></>
            )}
            <span
                className="font-medium text-zinc-200 text-sm md:text-base truncate"
                title={software.name}
            >
                {software.name}
            </span>
        </div>
    );
}

const getMetricClasses = (isWinner: boolean, isTie: boolean) => {
    if (isWinner) {
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]';
    }
    if (isTie) {
        return 'bg-zinc-800/30 text-zinc-300 border-zinc-700/50';
    }
    return 'bg-red-500/5 text-red-400/80 border-red-500/10';
};

export default function ComparisonDetails({
    comparison,
}: ComparisonDetailsProps) {
    const { softwareA, softwareB, metricsComparison, factorsComparison } =
        comparison;

    const hasAnyComparison =
        metricsComparison.length > 0 || factorsComparison.length > 0;

    return (
        <div className="mt-8 bg-[#111114] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-zinc-900/40 p-6 md:p-8 border-b border-zinc-800">
                <h3 className="text-2xl font-bold text-white text-center">
                    Comparison Details
                </h3>
            </div>

            {hasAnyComparison && (
                <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-end justify-between px-2 md:px-4 mb-2 md:mb-4">
                        <div className="hidden md:block w-1/3 pb-1 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Metrics & Features
                        </div>
                        <div className="flex w-full md:w-2/3 justify-between gap-3 md:gap-6">
                            <div className="flex-1 min-w-0">
                                <SoftwareColumnHeader software={softwareA} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <SoftwareColumnHeader software={softwareB} />
                            </div>
                        </div>
                    </div>

                    {/* Metrics */}
                    {metricsComparison.map((metric) => {
                        const isAWinner = metric.winner === 'a';
                        const isBWinner = metric.winner === 'b';
                        const isTie = metric.winner === null;

                        return (
                            <div
                                key={`metric-${metric.metricId}`}
                                className="flex flex-col md:flex-row items-center justify-between p-3 md:p-5 bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors rounded-2xl border border-zinc-800/80 group"
                            >
                                <div className="w-full md:w-1/3 text-zinc-300/80 font-medium text-center md:text-left mb-3 md:mb-0 group-hover:text-white transition-colors text-sm md:text-base truncate">
                                    {metric.metricName}
                                </div>

                                <div className="flex w-full md:w-2/3 justify-between items-stretch gap-3 md:gap-6">
                                    <div
                                        className={`flex-1 flex flex-col items-center justify-center py-2 md:py-3 px-2 rounded-xl border transition-all ${getMetricClasses(
                                            isAWinner,
                                            isTie,
                                        )}`}
                                    >
                                        <span className="text-base md:text-lg font-semibold leading-none">
                                            {metric.aValue !== null
                                                ? metric.aValue
                                                : '-'}
                                        </span>
                                    </div>

                                    <div
                                        className={`flex-1 flex flex-col items-center justify-center py-2 md:py-3 px-2 rounded-xl border transition-all ${getMetricClasses(
                                            isBWinner,
                                            isTie,
                                        )}`}
                                    >
                                        <span className="text-base md:text-lg font-semibold leading-none">
                                            {metric.bValue !== null
                                                ? metric.bValue
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Factors */}
                    {factorsComparison.map((factor) => {
                        const isTie = factor.winner === null;

                        return (
                            <div
                                key={`factor-${factor.factorId}`}
                                className="flex flex-col md:flex-row items-center justify-between p-3 md:p-5 bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors rounded-2xl border border-zinc-800/80 group"
                            >
                                <div className="w-full md:w-1/3 text-zinc-300/80 font-medium text-center md:text-left mb-3 md:mb-0 group-hover:text-white transition-colors text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                                    <span>{factor.factorName}</span>
                                    {!factor.isPositive && (
                                        <span className="text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md">
                                            Con
                                        </span>
                                    )}
                                </div>

                                <div className="flex w-full md:w-2/3 justify-between items-stretch gap-3 md:gap-6">
                                    {FactorBox(
                                        factor.hasA,
                                        factor.isPositive,
                                        isTie,
                                    )}
                                    {FactorBox(
                                        factor.hasB,
                                        factor.isPositive,
                                        isTie,
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
