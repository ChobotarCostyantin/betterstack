'use client';

import { forbidden } from 'next/navigation';
import { me } from '@/src/api/auth/auth.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { useEffect, useState } from 'react';

export default function Admin() {
    const [status, setStatus] = useState<
        'loading' | 'authorized' | 'forbidden'
    >('loading');

    useEffect(() => {
        async function checkAccess() {
            try {
                const session = await me(browserClient);

                if (session.role === 'admin') {
                    setStatus('authorized');
                } else {
                    setStatus('forbidden');
                }
            } catch {
                setStatus('forbidden');
            }
        }

        checkAccess();
    }, []);

    if (status === 'forbidden') {
        forbidden();
    }

    if (status === 'loading') {
        return null;
    }

    return <h1>Hello</h1>;
}
