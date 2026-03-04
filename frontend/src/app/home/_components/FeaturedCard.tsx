'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Software } from '@/src/lib/types';
import { getCategoryByIdAction } from '@/src/lib/api';

interface FeaturedCardProps {
    item: Software;
}

export default function FeaturedCard({ item }: FeaturedCardProps) {
    const [categoryNames, setCategoryNames] = useState<Record<number, string>>(
        {},
    );
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasLogo = item.logoUrl && item.logoUrl.trim() !== '';
    const displayCategories = item.categoryIds?.slice(0, 2) || [];
    const hasMore = (item.categoryIds?.length || 0) > 2;

    useEffect(() => {
        if (imgRef.current?.complete) setIsImageLoading(false);
    }, [item.logoUrl]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!item.categoryIds || item.categoryIds.length === 0) return;
            const newNames: Record<number, string> = {};
            await Promise.all(
                item.categoryIds.map(async (id) => {
                    try {
                        const category = await getCategoryByIdAction(id);
                        if (category?.name) newNames[id] = category.name;
                    } catch (error) {
                        newNames[id] = `ID #${id}`;
                    }
                }),
            );
            setCategoryNames(newNames);
        };
        fetchCategories();
    }, [item.categoryIds]);

    return (
        <div className="relative w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-11px)] min-h-45">
            <Link
                href={`/article/${item.id}`}
                className="block h-full p-8 rounded-2xl bg-[#111114] border border-zinc-800 hover:border-zinc-600 transition-all group flex-col shadow-xl"
            >
                <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {hasLogo && (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                {isImageLoading && !imageError && (
                                    <div className="absolute inset-0 z-10 bg-zinc-800 animate-pulse" />
                                )}
                                {imageError ? (
                                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center border border-zinc-800">
                                        <span className="text-[10px] text-zinc-600 font-black uppercase">
                                            ERR
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        ref={imgRef}
                                        src={item.logoUrl}
                                        alt={item.name}
                                        className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                        onLoad={() => setIsImageLoading(false)}
                                        onError={() => {
                                            setImageError(true);
                                            setIsImageLoading(false);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors truncate">
                            {item.name}
                        </h3>
                    </div>
                </div>

                <p className="text-base text-zinc-400 leading-relaxed mb-6 line-clamp-2">
                    {item.shortDescription}
                </p>

                <div
                    className="mt-auto flex flex-wrap gap-2 items-center"
                    ref={containerRef}
                >
                    {displayCategories.map((id) => (
                        <span
                            key={id}
                            title={categoryNames[id]}
                            className="max-w-30 truncate text-[11px] px-3 py-1 rounded-lg bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 uppercase font-semibold transition-all"
                        >
                            {categoryNames[id] || '...'}
                        </span>
                    ))}

                    {hasMore && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors font-bold flex items-center gap-1 shadow-lg"
                            >
                                <span>+{item.categoryIds!.length - 2}</span>
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
                            </button>

                            {isExpanded && (
                                <div className="absolute bottom-full left-0 mb-3 w-64 p-4 rounded-2xl bg-[#1c1c21] border border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-100 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
                                    <div className="text-[10px] text-zinc-500 w-full mb-3 font-black uppercase tracking-widest border-b border-zinc-800 pb-2">
                                        All categories
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.categoryIds!.map((id) => (
                                            <span
                                                key={id}
                                                className="max-w-full truncate text-[10px] px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium"
                                                title={categoryNames[id]}
                                            >
                                                {categoryNames[id] || '...'}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1c1c21] border-r border-b border-zinc-700 rotate-45"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
