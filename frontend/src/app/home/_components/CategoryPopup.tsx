'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CategoryPopupProps {
    categoryIds: number[];
    categoryNames: Record<number, string>;
    variant: 'card' | 'search';
    coords?: { top: number; right: number };
    popupRef: React.RefObject<HTMLDivElement | null>;
}

export default function CategoryPopup({
    categoryIds,
    categoryNames,
    variant,
    coords,
    popupRef,
}: CategoryPopupProps) {
    const [mounted, setMounted] = useState(false);
    const isCard = variant === 'card';

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = (
        <>
            <div className={`text-zinc-500 w-full font-black uppercase tracking-widest border-b border-zinc-800 ${isCard ? 'text-[10px] mb-3 pb-2' : 'text-[9px] mb-2 pb-1.5 text-left'}`}>
                All categories
            </div>
            <div className={`flex flex-wrap ${isCard ? 'gap-2' : 'gap-1.5 justify-start'}`}>
                {categoryIds.map((id) => (
                    <span
                        key={id}
                        className={`max-w-full truncate rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium ${isCard ? 'text-[10px] px-2.5 py-1' : 'text-[9px] px-2 py-1'}`}
                        title={categoryNames[id]}
                    >
                        {categoryNames[id] || '...'}
                    </span>
                ))}
            </div>
            {isCard && (
                <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1c1c21] border-r border-b border-zinc-700 rotate-45"></div>
            )}
        </>
    );

    if (isCard) {
        return (
            <div
                ref={popupRef}
                className="absolute bottom-full left-0 mb-3 w-64 p-4 rounded-2xl bg-[#1c1c21] border border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-100 animate-in fade-in zoom-in-95 cursor-default"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
                {content}
            </div>
        );
    }

    if (!mounted || typeof document === 'undefined' || !coords) return null;

    return createPortal(
        <div
            ref={popupRef}
            style={{
                position: 'fixed',
                top: `${coords.top}px`,
                right: `${coords.right}px`,
            }}
            className="w-56 p-3 rounded-xl bg-[#1c1c21] border border-zinc-700 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-9999 animate-in fade-in zoom-in-95 cursor-default"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {content}
        </div>,
        document.body
    );
}