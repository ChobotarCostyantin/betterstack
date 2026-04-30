'use client';

import { useEffect, useRef } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { AnalyticsEvent } from '../api/common/analytics.enums';

export default function ScrollTracker() {
    const tracked75 = useRef(false);
    const pathname = usePathname();

    useEffect(() => {
        // Skip tracking for non-SEO pages like /admin
        if (pathname.startsWith('/admin')) {
            return;
        }

        const handleScroll = () => {
            if (tracked75.current) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            // If page is too short (fits in one viewport), we don't trigger scroll_75
            // because the user didn't actually "scroll" through content
            if (scrollHeight <= clientHeight) {
                return;
            }

            const scrollPercentage =
                ((scrollTop + clientHeight) / scrollHeight) * 100;

            if (scrollPercentage >= 75) {
                sendGTMEvent({
                    event: AnalyticsEvent.SCROLL_75,
                    page_path: pathname,
                });
                tracked75.current = true;
            }
        };

        // Reset tracking state on pathname change
        tracked75.current = false;

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case page is already scrolled or we want to catch logic
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    return null;
}
