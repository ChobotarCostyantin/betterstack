'use client';

import { useState } from 'react';
import { browserClient } from '@/src/lib/api/browser.client';
import {
    markSoftwareAsUsed,
    markSoftwareAsUnused,
} from '@/src/api/users/users.api';
import { CheckIcon, PlusIcon, Loader2Icon } from 'lucide-react';

interface UseSoftwareButtonProps {
    softwareId: number;
    initialIsUsed?: boolean;
}

export default function UseSoftwareButton({
    softwareId,
    initialIsUsed = false,
}: UseSoftwareButtonProps) {
    const [isUsed, setIsUsed] = useState(initialIsUsed);
    const [isLoading, setIsLoading] = useState(false);

    const toggleUsed = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isUsed) {
                await markSoftwareAsUnused(browserClient, softwareId);
                setIsUsed(false);
            } else {
                await markSoftwareAsUsed(browserClient, softwareId);
                setIsUsed(true);
            }
        } catch (error) {
            console.error('Failed to toggle software usage status', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleUsed}
            disabled={isLoading}
            className={`flex items-center gap-2 h-11 sm:h-12 px-4 rounded-xl border transition-all duration-300 font-medium text-sm sm:text-base shrink-0 outline-none ${
                isUsed
                    ? 'bg-zinc-800/80 border-zinc-400/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.12)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:border-zinc-300 hover:bg-zinc-700/80'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/50'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <Loader2Icon
                    className="w-5 h-5 animate-spin"
                    strokeWidth={2.5}
                />
            ) : isUsed ? (
                <CheckIcon className="w-5 h-5" strokeWidth={2.5} />
            ) : (
                <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
            )}
            <span>{isUsed ? 'Used' : 'I used this'}</span>
        </button>
    );
}
