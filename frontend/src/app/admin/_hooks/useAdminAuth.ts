import { useEffect, useState } from 'react';
import { me } from '@/src/api/auth/auth.api';
import { browserClient } from '@/src/lib/api/browser.client';

export function useAdminAuth() {
    const [status, setStatus] = useState<
        'loading' | 'authorized' | 'forbidden'
    >('loading');

    useEffect(() => {
        async function checkAccess() {
            try {
                const session = await me(browserClient);
                setStatus(
                    session.role === 'admin' ? 'authorized' : 'forbidden',
                );
            } catch {
                setStatus('forbidden');
            }
        }
        checkAccess();
    }, []);

    return status;
}
