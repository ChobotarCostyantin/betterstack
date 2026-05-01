'use client';

import { useState } from 'react';
import { browserClient } from '@/src/lib/api/browser.client';
import { markSoftwareAsUnused } from '@/src/api/users/users.api';

export default function RemoveFromStackButton({
    softwareId,
    onRemoved,
}: {
    softwareId: number;
    onRemoved: (id: number) => void;
}) {
    const [removing, setRemoving] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        setRemoving(true);
        try {
            await markSoftwareAsUnused(browserClient, softwareId);
            onRemoved(softwareId);
        } catch (err) {
            console.error('Failed to remove software:', err);
        } finally {
            setRemoving(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={removing}
            className="absolute top-3 right-3 z-30 opacity-0 group-hover/card:opacity-100 transition-opacity px-2.5 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium backdrop-blur-sm disabled:opacity-50"
        >
            {removing ? 'Removing…' : 'Remove'}
        </button>
    );
}
