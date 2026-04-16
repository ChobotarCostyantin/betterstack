import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export const ScreenshotItem = ({
    url,
    index,
    onClick,
    priority = false,
}: {
    url: string;
    index: number;
    onClick: () => void;
    priority?: boolean;
}) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="flex-none snap-start shrink-0 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-500 h-48 sm:h-56 md:h-64 min-w-75 sm:min-w-87.5 md:min-w-100">
                <ImageOff size={32} className="mb-2 opacity-50" />
                <span className="text-sm font-medium select-none">
                    Image is not available
                </span>
                <span
                    className="text-xs opacity-70 truncate px-4 max-w-full select-none"
                    title={url}
                >
                    {url.split('/')[2]}
                </span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex-none cursor-pointer snap-start shrink-0 group/item rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors h-48 sm:h-56 md:h-64 relative min-w-75 sm:min-w-87.5 md:min-w-100 bg-zinc-900/50"
        >
            <Image
                src={url}
                alt={`Screenshot ${index + 1}`}
                fill
                priority={priority}
                className="object-contain transition-transform duration-500 group-hover/item:scale-105"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, 400px"
                onError={() => setHasError(true)}
            />
        </div>
    );
};
