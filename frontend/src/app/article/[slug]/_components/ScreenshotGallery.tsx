'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface ScreenshotGalleryProps {
    screenshots?: string[];
}

export default function ScreenshotGallery({
    screenshots,
}: ScreenshotGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            const scrollAmount = carouselRef.current.clientWidth * 0.8;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Screenshots</h2>

            <div className="relative group">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('left');
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-zinc-800/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:scale-110 shadow-lg backdrop-blur-sm disabled:hidden"
                    aria-label="Previous screenshot"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <div 
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center"
                >
                    {screenshots.map((url, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(url)}
                            className="relative h-48 sm:h-56 md:h-64 flex-none cursor-pointer snap-center group/item"
                        >
                            <img
                                src={url}
                                alt={`Screenshot ${index + 1}`}
                                className="h-full w-auto"
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('right');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-zinc-800/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:scale-110 shadow-lg backdrop-blur-sm"
                    aria-label="Next screenshot"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            {selectedImage &&
                mounted &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 z-9999 bg-black/85 flex items-center justify-center cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh] max-w-7xl cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Full screen screenshot"
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                    </div>,
                    document.body,
                )}
        </section>
    );
}
