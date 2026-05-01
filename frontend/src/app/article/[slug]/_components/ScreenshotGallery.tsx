'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { ScreenshotItem } from './ScreenshotItem';
import Image from 'next/image';
import type { Screenshot } from '@/src/api/software/software.schemas';

interface ScreenshotGalleryProps {
    screenshots?: Screenshot[];
}

function subscribe() {
    return () => {};
}

export default function ScreenshotGallery({
    screenshots,
}: ScreenshotGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isScrollable, setIsScrollable] = useState(false);
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

        setIsScrollable(scrollWidth > Math.ceil(clientWidth) + 1);
        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(
            Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2,
        );
    };

    useEffect(() => {
        const timeoutId = setTimeout(updateScrollState, 100);
        const ref = carouselRef.current;

        if (ref) {
            ref.addEventListener('scroll', updateScrollState, {
                passive: true,
            });
        }
        window.addEventListener('resize', updateScrollState);

        return () => {
            clearTimeout(timeoutId);
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

    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    if (!screenshots || screenshots.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const firstChild = container.firstElementChild as HTMLElement;
        if (!firstChild) return;

        const containerStyle = window.getComputedStyle(container);
        const gap = parseFloat(containerStyle.gap) || 0;
        const itemWidth = firstChild.offsetWidth + gap;

        const visibleItems = Math.max(
            1,
            Math.floor(container.clientWidth / itemWidth),
        );
        const scrollAmount = itemWidth * visibleItems;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const handleImageSelect = (screenshot: Screenshot) => {
        setIsLoadingFullscreen(true);
        setSelectedImage(screenshot);
    };

    const closeFullscreen = () => {
        setSelectedImage(null);
        setIsLoadingFullscreen(true);
    };

    return (
        <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                Screenshots
            </h2>

            <div className="relative group">
                {isScrollable && canScrollLeft && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            scroll('left');
                        }}
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-zinc-800/80 text-zinc-200 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white hover:scale-110 shadow-lg backdrop-blur-sm"
                        aria-label="Previous Screenshot"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                )}

                <div
                    ref={carouselRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center scroll-smooth"
                >
                    {screenshots.map((screenshot, index) => (
                        <ScreenshotItem
                            key={`${screenshot.url}-${index}`}
                            url={screenshot.url}
                            alt={screenshot.alt}
                            index={index}
                            onClick={() => handleImageSelect(screenshot)}
                        />
                    ))}
                </div>

                {isScrollable && canScrollRight && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            scroll('right');
                        }}
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-zinc-800/80 text-zinc-200 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white hover:scale-110 shadow-lg backdrop-blur-sm"
                        aria-label="Next Screenshot"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                )}
            </div>

            {selectedImage &&
                mounted &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 z-9999 bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out backdrop-blur-md"
                        onClick={closeFullscreen}
                    >
                        <div
                            className="relative w-full h-full max-w-7xl flex items-center justify-center cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!isLoadingFullscreen && (
                                <button
                                    onClick={closeFullscreen}
                                    className="absolute top-0 right-0 z-10000 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer bg-zinc-900/80 border border-zinc-700 shadow-xl rounded-full backdrop-blur-sm"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            )}

                            {isLoadingFullscreen && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                                </div>
                            )}

                            <Image
                                src={selectedImage.url}
                                alt={
                                    selectedImage.alt || 'Screenshot Fullscreen'
                                }
                                fill
                                className={`object-contain transition-opacity duration-300 ${
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
