'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { ScreenshotItem } from './ScreenshotItem';
import Image from 'next/image';

interface ScreenshotGalleryProps {
    screenshots?: string[];
}

function subscribe() {
    return () => {};
}

export default function ScreenshotGallery({
    screenshots,
}: ScreenshotGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isLoadingFullscreen, setIsLoadingFullscreen] = useState(true);

    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const carouselRef = useRef<HTMLDivElement>(null);

    const updateScrollState = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        updateScrollState();

        const ref = carouselRef.current;
        if (ref) ref.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);

        return () => {
            if (ref) ref.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [screenshots]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        if (selectedImage) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    if (!screenshots || screenshots.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const firstChild = carouselRef.current
                .firstElementChild as HTMLElement | null;
            const itemWidth = firstChild?.offsetWidth || 0;
            const gap = 16;
            const scrollAmount = itemWidth + gap;

            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleImageSelect = (url: string) => {
        setIsLoadingFullscreen(true);
        setSelectedImage(url);
    };

    const closeFullscreen = () => {
        setSelectedImage(null);
        setIsLoadingFullscreen(true);
    };

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Screenshots</h2>

            <div className="relative group">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('left');
                    }}
                    disabled={!canScrollLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-zinc-800/80 text-zinc-200 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white hover:scale-110 shadow-lg backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none"
                    aria-label="Previous Screenshot"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center"
                >
                    {screenshots.map((url, index) => (
                        <ScreenshotItem
                            key={`${url}-${index}`}
                            url={url}
                            index={index}
                            onClick={() => handleImageSelect(url)}
                        />
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('right');
                    }}
                    disabled={!canScrollRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-zinc-800/80 text-zinc-200 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white hover:scale-110 shadow-lg backdrop-blur-sm disabled:opacity-0 disabled:pointer-events-none"
                    aria-label="Next Screenshot"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {selectedImage &&
                mounted &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
                        onClick={closeFullscreen}
                    >
                        <div
                            className="relative flex items-center justify-center cursor-default max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!isLoadingFullscreen && (
                                <button
                                    onClick={closeFullscreen}
                                    className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-10000 p-1.5 md:p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-700 shadow-xl rounded-full"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            )}
                            {isLoadingFullscreen && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                                </div>
                            )}

                            <Image
                                src={selectedImage}
                                alt="Screenshot"
                                width={1920}
                                height={1080}
                                className={`object-contain w-auto h-auto max-w-full max-h-[90vh] rounded-md shadow-2xl transition-opacity duration-300 ${
                                    isLoadingFullscreen
                                        ? 'opacity-0'
                                        : 'opacity-100'
                                }`}
                                sizes="100vw"
                                quality={100}
                                onLoad={() => setIsLoadingFullscreen(false)}
                                onError={closeFullscreen}
                            />
                        </div>
                    </div>,
                    document.body,
                )}
        </section>
    );
}
