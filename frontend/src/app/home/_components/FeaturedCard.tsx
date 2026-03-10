'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';
import CategoryTags from '@/src/components/CategoryTags';

interface FeaturedCardProps {
    item: SoftwareListItem;
}

export default function FeaturedCard({ item }: FeaturedCardProps) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const hasLogo = item.logoUrl && item.logoUrl.trim() !== '';

    return (
        <div className="relative w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-11px)] min-h-45">
            <Link
                href={`/article/${item.slug}`}
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
                            className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors truncate"
                        >
                            {item.name}
                        </h3>
                    </div>
                </div>

                <p
                    title={item.shortDescription}
                    className="text-base text-zinc-400 leading-relaxed mb-6 line-clamp-2"
                >
                    {item.shortDescription}
                </p>

                <CategoryTags categories={item.categories} />
            </Link>
        </div>
    );
}
