'use client';

import { Software, Criterion } from '@/src/lib/types';

interface ComparisonDetailsProps {
    software: Software;
    otherSoftware: Software;
    criteria: Criterion[];
}

export default function ComparisonDetails({
    software,
    otherSoftware,
    criteria
}: ComparisonDetailsProps) {
    const getWinner = (criterion: Criterion, softwareA: Software, softwareB: Software) => {
        const valueA = softwareA.features[criterion.id];
        const valueB = softwareB.features[criterion.id];

        if (valueA === undefined || valueA === null || valueB === undefined || valueB === null) return null;

        switch (criterion.type) {
            case 'rating':
                // Higher rating is better
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    if (valueA > valueB) return 0; // softwareA wins
                    if (valueA < valueB) return 1; // softwareB wins
                    return 2; // tie
                }
                break;
            case 'boolean':
                // True is better
                if (valueA === true && valueB !== true) return 0;
                if (valueB === true && valueA !== true) return 1;
                if (valueA === valueB) return 2; // both true or both false
                break;
            case 'currency':
                // Lower cost is better
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    if (valueA < valueB) return 0; // softwareA wins (lower cost)
                    if (valueA > valueB) return 1; // softwareB wins (lower cost)
                    return 2; // same cost
                }
                break;
        }
        return null; // No comparison possible
    };

    const getFeatureValue = (software: Software, criterionId: number) => {
        const value = software.features[criterionId];
        if (value === undefined || value === null) return 'N/A';

        const criterion = criteria.find(c => c.id === criterionId);
        if (!criterion) return value;

        switch (criterion.type) {
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'rating':
                return typeof value === 'number' ? `${value}/5` : value;
            case 'currency':
                return typeof value === 'number' ? `$${value}` : value;
            default:
                return value;
        }
    };

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Comparison Details:</h4>
            {criteria.map((criterion) => {
                const winner = getWinner(criterion, software, otherSoftware);
                const isWinner = winner === 0;
                const isLoser = winner === 1;

                return (
                    <div key={criterion.id} className={`flex justify-between items-center py-2 px-3 rounded transition-colors ${
                        isWinner
                            ? 'bg-emerald-900/30 text-emerald-200 font-bold' // Winner: whole row green background, bold text
                            : isLoser
                            ? 'bg-red-900/20 text-red-200' // Loser: slight red background
                            : winner === 2
                            ? 'bg-yellow-900/20 text-yellow-200 font-bold' // Tie: light yellow background, bold text
                            : 'bg-zinc-800/50 text-zinc-300' // No comparison
                    }`}>
                        <span className="text-sm">{criterion.name}</span>
                        <span className="text-sm">
                            {getFeatureValue(software, criterion.id)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}