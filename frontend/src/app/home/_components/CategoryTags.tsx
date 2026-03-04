'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface CategoryTagsProps {
    categoryIds?: number[] | null;
    categoryNames: Record<number, string>;
    maxDisplay?: number;
    variant?: 'card' | 'search';
}

export default function CategoryTags({
    categoryIds,
    categoryNames,
    maxDisplay = 2,
    variant = 'card',
}: CategoryTagsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [coords, setCoords] = useState({ top: 0, right: 0 });
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const isCard = variant === 'card';

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                containerRef.current?.contains(target) ||
                popupRef.current?.contains(target)
            ) {
                return;
            }
            setIsExpanded(false);
        };

        const handleScroll = () => {
            if (isExpanded) setIsExpanded(false);
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isExpanded]);

    if (!categoryIds || categoryIds.length === 0) return null;

    const displayCategories = categoryIds.slice(0, maxDisplay);
    const hasMore = categoryIds.length > maxDisplay;

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isExpanded && !isCard && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setIsExpanded(!isExpanded);
    };

    const tagClasses = isCard
        ? 'max-w-[120px] text-[11px] px-3 py-1'
        : 'max-w-[100px] text-[9px] px-2 py-1 group-hover:bg-zinc-800';
    const btnClasses = isCard
        ? 'text-[11px] px-2.5 py-1'
        : 'text-[9px] px-2 py-1';

    const renderCardPopup = () => (
        <div
            ref={popupRef}
            className="absolute bottom-full left-0 mb-3 w-64 p-4 rounded-2xl bg-[#1c1c21] border border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-100 animate-in fade-in zoom-in-95 cursor-default"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="text-[10px] mb-3 pb-2 text-zinc-500 w-full font-black uppercase tracking-widest border-b border-zinc-800">
                All categories
            </div>
            <div className="flex flex-wrap gap-2">
                {categoryIds.map((id) => (
                    <span
                        key={id}
                        className="text-[10px] px-2.5 py-1 max-w-full truncate rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium"
                        title={categoryNames[id]}
                    >
                        {categoryNames[id] || '...'}
                    </span>
                ))}
            </div>
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1c1c21] border-r border-b border-zinc-700 rotate-45"></div>
        </div>
    );

    const renderSearchPopup = () => {
        if (!mounted || typeof document === 'undefined') return null;

        return createPortal(
            <div
                ref={popupRef}
                style={{
                    position: 'fixed',
                    top: `${coords.top}px`,
                    right: `${coords.right}px`,
                }}
                className="w-56 p-3 rounded-xl bg-[#1c1c21] border border-zinc-700 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-9999 animate-in fade-in zoom-in-95 cursor-default"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div className="text-[9px] mb-2 pb-1.5 text-zinc-500 w-full font-black uppercase tracking-widest border-b border-zinc-800 text-left">
                    All categories
                </div>
                <div className="flex flex-wrap gap-1.5 justify-start">
                    {categoryIds.map((id) => (
                        <span
                            key={id}
                            className="text-[9px] px-2 py-1 max-w-full truncate rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium"
                            title={categoryNames[id]}
                        >
                            {categoryNames[id] || '...'}
                        </span>
                    ))}
                </div>
            </div>,
            document.body,
        );
    };

    return (
        <div
            className={`flex flex-wrap gap-1.5 shrink-0 ${isCard ? 'mt-auto items-center' : 'justify-end'}`}
            ref={containerRef}
        >
            {displayCategories.map((id) => (
                <span
                    key={id}
                    title={categoryNames[id]}
                    className={`${tagClasses} truncate rounded-lg bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 uppercase font-semibold transition-all`}
                >
                    {categoryNames[id] || '...'}
                </span>
            ))}

            {hasMore && (
                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={handleToggle}
                        className={`${btnClasses} rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors font-bold flex items-center gap-1 shadow-lg`}
                    >
                        <span>+{categoryIds.length - maxDisplay}</span>
                        {isCard && (
                            <svg
                                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        )}
                    </button>

                    {isExpanded && isCard && renderCardPopup()}
                    {isExpanded && !isCard && renderSearchPopup()}
                </div>
            )}
        </div>
    );
}
