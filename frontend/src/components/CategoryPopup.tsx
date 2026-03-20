'use client';

import React, {
    useState,
    useEffect,
    useRef,
    useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

interface CategoryPopupProps {
    categories: string[];
    maxDisplay: number;
}

function subscribe() {
    return () => {};
}

export default function CategoryPopup({
    categories,
    maxDisplay,
}: CategoryPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const hiddenCount = categories.length - maxDisplay;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                buttonRef.current?.contains(target) ||
                popupRef.current?.contains(target)
            ) {
                return;
            }
            setIsOpen(false);
        };

        const handleScroll = (event: Event) => {
            if (popupRef.current?.contains(event.target as Node)) return;
            if (isOpen) setIsOpen(false);
        };

        const handleResize = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    if (hiddenCount <= 0) return null;

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top,
                left: rect.left,
            });
        }
        setIsOpen(!isOpen);
    };

    const popupContent =
        isOpen && mounted && typeof document !== 'undefined'
            ? createPortal(
                  <div
                      ref={popupRef}
                      style={{
                          position: 'fixed',
                          bottom: window.innerHeight - coords.top + 10,
                          left: coords.left,
                      }}
                      className="w-64 p-4 rounded-2xl bg-[#1c1c21] border border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-9999 animate-in fade-in zoom-in-95 cursor-default"
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                      }}
                  >
                      <div className="text-zinc-500 w-full font-black uppercase tracking-widest border-b border-zinc-800 text-[10px] mb-3 pb-2">
                          All categories
                      </div>

                      <div className="flex flex-wrap gap-2">
                          {categories.map((name) => (
                              <span
                                  key={name}
                                  className="max-w-full truncate rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium text-[10px] px-2.5 py-1"
                                  title={name}
                              >
                                  {name}
                              </span>
                          ))}
                      </div>

                      <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1c1c21] border-r border-b border-zinc-700 rotate-45"></div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors font-bold flex items-center gap-1 shadow-lg"
            >
                <span>+{hiddenCount}</span>
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            {popupContent}
        </>
    );
}
