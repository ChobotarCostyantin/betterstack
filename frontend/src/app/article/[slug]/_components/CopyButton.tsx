'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/50 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm z-10"
            aria-label="Copy code"
            title="Copy code"
        >
            {copied ? (
                <Check className="text-emerald-400" size={16} />
            ) : (
                <Copy size={16} />
            )}
        </button>
    );
};
