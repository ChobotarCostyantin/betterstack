import { SoftwareListItem } from '@/src/api/software/software.schemas';
import { useState } from 'react';
import Image from 'next/image';
import CategoryTags from '@/src/components/CategoryTags';

export default function SelectorResultItem({
    software,
    onSelect,
    onCloseAction,
}: {
    software: SoftwareListItem;
    onSelect: (slug: string) => void;
    onCloseAction: () => void;
}) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const hasLogo = software.logoUrl && software.logoUrl.trim() !== '';

    const handleClick = () => {
        onSelect(software.slug);
        onCloseAction();
    };

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-800/50 transition-colors group rounded-xl text-left"
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
                            <Image
                                unoptimized
                                src={software.logoUrl!}
                                alt={software.name}
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

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-zinc-200 font-medium truncate">
                        {software.name}
                    </span>
                    {software.shortDescription && (
                        <span className="text-sm text-zinc-500 truncate">
                            {software.shortDescription}
                        </span>
                    )}
                </div>
            </div>

            {software.categories && (
                <CategoryTags categories={software.categories} />
            )}
        </button>
    );
}
