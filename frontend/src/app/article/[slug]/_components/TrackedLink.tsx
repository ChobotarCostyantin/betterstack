'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import Link from 'next/link';
import React from 'react';
import { AnalyticsEvent } from '@/src/api/common/analytics.enums';

interface TrackedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    eventName: AnalyticsEvent;
    eventParams?: Record<string, string | number | boolean | undefined>;
}

export default function TrackedLink({
    href,
    children,
    className,
    eventName,
    eventParams = {},
}: TrackedLinkProps) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onClick={() => sendGTMEvent({ event: eventName, ...eventParams })}
        >
            {children}
        </Link>
    );
}
