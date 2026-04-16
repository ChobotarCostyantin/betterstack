import { redirect } from 'next/navigation';
import { createServerClient } from '@/src/lib/api/server.client';
import SettingsClient from './SettingsClient';
import { me } from '@/src/api/auth/auth.api.server';

export default async function SettingsPage() {
    const serverClient = await createServerClient();
    const user = await me(serverClient);

    if (!user) {
        redirect('/login');
    }

    return <SettingsClient initialUser={user} />;
}
