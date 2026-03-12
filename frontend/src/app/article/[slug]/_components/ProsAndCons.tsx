import {
    CheckIcon,
    MinusIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
} from 'lucide-react';

interface ProsAndConsProps {
    softwareName: string;
    factors?: {
        positive?: Array<{ factorId: number; factorName: string }>;
        negative?: Array<{ factorId: number; factorName: string }>;
    };
}

export default function ProsAndCons({
    softwareName,
    factors,
}: ProsAndConsProps) {
    if (!factors?.positive?.length && !factors?.negative?.length) {
        return null;
    }

    return (
        <section className="mb-8 sm:mb-12">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 whitespace-nowrap">
                    Pros & Cons
                </h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6">
                {/* Pros */}
                {factors.positive && factors.positive.length > 0 && (
                    <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-200 flex items-center justify-center gap-2">
                            <ThumbsUpIcon className="text-zinc-500 shrink-0 w-5 h-5" />
                            Pros of {softwareName}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {factors.positive.map((factor) => (
                                <li
                                    key={factor.factorId}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 shrink-0 text-zinc-500/80">
                                        <CheckIcon
                                            className="w-4.5 h-4.5"
                                            strokeWidth={3}
                                        />
                                    </span>
                                    <span className="text-sm sm:text-base text-zinc-300">
                                        {factor.factorName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cons */}
                {factors.negative && factors.negative.length > 0 && (
                    <div className="w-full md:w-[calc(50%-12px)] flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-200 flex items-center justify-center gap-2">
                            <ThumbsDownIcon className="text-zinc-500 shrink-0 w-5 h-5" />
                            Cons of {softwareName}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {factors.negative.map((factor) => (
                                <li
                                    key={factor.factorId}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 shrink-0 text-zinc-500/80">
                                        <MinusIcon
                                            className="w-4.5 h-4.5"
                                            strokeWidth={3}
                                        />
                                    </span>
                                    <span className="text-sm sm:text-base text-zinc-300">
                                        {factor.factorName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
