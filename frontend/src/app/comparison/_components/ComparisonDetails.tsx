'use client';

import type { SoftwareComparison } from '@/src/api/software/software.schemas';

interface ComparisonDetailsProps {
    comparison: SoftwareComparison;
}

export default function ComparisonDetails({
    comparison,
}: ComparisonDetailsProps) {
    const { softwareA, softwareB, metricsComparison, comparisonNote } =
        comparison;

    return (
        <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
                {softwareA.name} <span className="text-zinc-500 mx-2">vs</span>{' '}
                {softwareB.name}
            </h3>

            {comparisonNote && (
                <div className="mb-8 p-4 bg-zinc-800/80 border border-zinc-700 rounded-lg text-zinc-300 text-center italic">
                    {comparisonNote}
                </div>
            )}

            <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                    Metrics Comparison
                </h4>

                <div className="space-y-3">
                    {metricsComparison.map((metric) => {
                        const isAWinner = metric.winner === 'a';
                        const isBWinner = metric.winner === 'b';
                        const isTie = metric.winner === null;

                        return (
                            <div
                                key={metric.metricId}
                                className="flex flex-col md:flex-row items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-800"
                            >
                                <div className="w-full md:w-1/3 text-zinc-300 font-medium text-center md:text-left mb-3 md:mb-0">
                                    {metric.metricName}
                                </div>

                                <div className="flex w-full md:w-2/3 justify-between items-center gap-4">
                                    <div
                                        className={`flex-1 text-center p-3 rounded-lg transition-colors ${
                                            isAWinner
                                                ? 'bg-emerald-900/30 text-emerald-300 font-bold border border-emerald-800/50'
                                                : isTie
                                                  ? 'bg-yellow-900/20 text-yellow-300 font-bold border border-yellow-800/30'
                                                  : 'bg-zinc-900/80 text-zinc-400'
                                        }`}
                                    >
                                        {metric.aValue !== null
                                            ? metric.aValue
                                            : 'N/A'}
                                    </div>

                                    <div className="text-zinc-600 font-medium text-sm">
                                        VS
                                    </div>

                                    <div
                                        className={`flex-1 text-center p-3 rounded-lg transition-colors ${
                                            isBWinner
                                                ? 'bg-emerald-900/30 text-emerald-300 font-bold border border-emerald-800/50'
                                                : isTie
                                                  ? 'bg-yellow-900/20 text-yellow-300 font-bold border border-yellow-800/30'
                                                  : 'bg-zinc-900/80 text-zinc-400'
                                        }`}
                                    >
                                        {metric.bValue !== null
                                            ? metric.bValue
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
