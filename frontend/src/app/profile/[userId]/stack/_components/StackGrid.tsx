'use client';

import { useState } from 'react';
import SoftwareCard from '@/src/components/SoftwareCard';
import RemoveFromStackButton from './RemoveFromStackButton';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';

export default function StackGrid({
    initialStack,
    isOwner,
}: {
    initialStack: SoftwareListItem[];
    isOwner: boolean;
}) {
    const [stack, setStack] = useState(initialStack);

    const handleRemoved = (id: number) =>
        setStack((prev) => prev.filter((s) => s.id !== id));

    return (
        <div className="flex flex-wrap gap-5">
            {stack.map((item) => (
                <div key={item.id} className="relative group/card">
                    <SoftwareCard className="w-full h-full" item={item} />
                    {isOwner && (
                        <RemoveFromStackButton
                            softwareId={item.id}
                            onRemoved={handleRemoved}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
