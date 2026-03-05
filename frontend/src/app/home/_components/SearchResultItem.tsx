'use client';

import { ShortSoftware } from '@/src/lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CategoryTags from './CategoryTags';

export default function SearchResultItem({
    result,
    categoryNames,
    onClose,
}: {
    result: ShortSoftware;
    categoryNames: Record<number, string>;
    onClose: () => void;
}) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const hasLogo = result.logoUrl && result.logoUrl.trim() !== '';

    useEffect(() => {
        if (imgRef.current?.complete) setIsImageLoading(false);
    }, [result.logoUrl]);

    return (
        <Link
            href={`/article/${result.slug}`}
            onClick={onClose}
            className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-800/50 transition-colors group rounded-xl"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {hasLogo && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {isImageLoading && !imageError && (
                            <div className="absolute inset-0 z-10 bg-zinc-800 animate-pulse" />
                        )}
                        {imageError ? (
                            <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                                <span className="text-[8px] text-zinc-600 font-black uppercase">
                                    ERR
                                </span>
                            </div>
                        ) : (
                            <img
                                ref={imgRef}
                                src={result.logoUrl}
                                alt={result.name}
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

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-zinc-200 font-medium truncate">
                        {result.name}
                    </span>
                    {result.shortDescription && (
                        <span className="text-sm text-zinc-500 truncate">
                            {result.shortDescription}
                        </span>
                    )}
                </div>
            </div>

            <CategoryTags
                categoryIds={result.categoryIds}
                categoryNames={categoryNames}
                variant="search"
            />
        </Link>
    );
}
