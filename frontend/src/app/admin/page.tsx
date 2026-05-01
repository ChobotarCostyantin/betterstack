import { forbidden } from 'next/navigation';
import { createServerClient } from '@/src/lib/api/server.client';
import AdminClient from './AdminClient';
import { me } from '@/src/api/auth/auth.api.server';

export default async function AdminPage() {
    const serverClient = await createServerClient();
    const user = await me(serverClient);

    if (!user || user.role !== 'admin') {
        forbidden();
    }

    return <AdminClient />;
}
