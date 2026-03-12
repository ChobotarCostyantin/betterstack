import { AlertTriangle } from 'lucide-react';

export default function ComparisonError() {
    return (
        <div className="mt-8 bg-zinc-500/5 border border-zinc-500/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto text-center backdrop-blur-sm">
            <div className="flex justify-center mb-5">
                <div className="p-4 bg-zinc-500/10 rounded-full">
                    <AlertTriangle className="w-10 h-10 text-zinc-400" />
                </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zinc-200 mb-3">
                Comparison Unavailable
            </h3>
            <p className="text-sm md:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
                These two items cannot be compared. They might belong to
                completely different categories or lack common comparison
                metrics.
            </p>
        </div>
    );
}
