'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';
import CategoryTags from '@/src/components/CategoryTags';

interface FeaturedCardProps {
    item: SoftwareListItem;
}

export default function SoftwareCard({ item }: FeaturedCardProps) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const hasLogo = item.logoUrl && item.logoUrl.trim() !== '';

    return (
        <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-11px)] min-h-45">
            <Link
                href={`/article/${item.slug}`}
                className="relative block h-full p-8 rounded-2xl bg-[#111114] border border-zinc-800 hover:border-zinc-600 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-900/50 transition-all duration-300 group flex-col overflow-hidden z-0"
            >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-500/5 rounded-full blur-3xl group-hover:bg-zinc-400/10 transition-all duration-500 group-hover:scale-150 pointer-events-none -z-10" />

                <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none z-20" />

                <div className="flex justify-between items-start mb-6 gap-4 relative z-10">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {hasLogo && (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                {isImageLoading && !imageError && (
                                    <div className="absolute inset-0 z-10 bg-zinc-800 animate-pulse" />
                                )}
                                {imageError ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[10px] text-zinc-600 font-black uppercase">
                                            ERR
                                        </span>
                                    </div>
                                ) : (
                                    <Image
                                        unoptimized
                                        src={item.logoUrl!}
                                        alt={item.name}
                                        fill
                                        className={`object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                        onLoad={() => setIsImageLoading(false)}
                                        onError={() => {
                                            setImageError(true);
                                            setIsImageLoading(false);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        <h3
                            title={item.name}
                            className="text-xl font-bold text-white group-hover:text-zinc-100 transition-colors truncate"
                        >
                            {item.name}
                        </h3>
                    </div>
                </div>

                <p
                    title={item.shortDescription}
                    className="text-base text-zinc-400 leading-relaxed mb-6 line-clamp-2 relative z-10 group-hover:text-zinc-300 transition-colors"
                >
                    {item.shortDescription}
                </p>

                <div className="relative z-10">
                    <CategoryTags categories={item.categories} />
                </div>
            </Link>
        </div>
    );
}
