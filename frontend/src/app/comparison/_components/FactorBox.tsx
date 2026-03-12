export default function FactorBox(
    hasFactor: boolean,
    isPositive: boolean,
    isTie: boolean,
) {
    // A factor is considered "good" for the software if:
    // 1. It is a positive factor and the software has it.
    // 2. It is a negative factor (con) and the software does NOT have it.
    const isGood = isPositive ? hasFactor : !hasFactor;

    let containerClasses = '';

    if (isTie) {
        containerClasses =
            'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[inset_0_0_12px_rgba(249,115,22,0.05)]';
    } else if (isGood) {
        containerClasses =
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]';
    } else {
        containerClasses = 'bg-red-500/5 text-red-400/80 border-red-500/10';
    }

    return (
        <div
            className={`flex-1 flex flex-col items-center justify-center py-2 md:py-3 px-2 rounded-xl border transition-all ${containerClasses}`}
        >
            <span className="text-base md:text-lg font-semibold leading-none">
                {hasFactor ? 'Yes' : 'No'}
            </span>
        </div>
    );
}
