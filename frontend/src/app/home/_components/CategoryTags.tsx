'use client';

import { useState, useEffect, useRef } from 'react';
import CategoryPopup from './CategoryPopup'; // Перевір шлях імпорту

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

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const isCard = variant === 'card';

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

        const handleScroll = (event: Event) => {
            if (popupRef.current?.contains(event.target as Node)) return;
            if (isExpanded) setIsExpanded(false);
        };

        const handleResize = () => {
            if (isExpanded) setIsExpanded(false);
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
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
                            <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </button>

                    {isExpanded && (
                        <CategoryPopup
                            categoryIds={categoryIds}
                            categoryNames={categoryNames}
                            variant={variant}
                            coords={coords}
                            popupRef={popupRef}
                        />
                    )}
                </div>
            )}
        </div>
    );
}