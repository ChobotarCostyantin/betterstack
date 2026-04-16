import { KyInstance } from 'ky';
import { cookies } from 'next/headers';
import { User, UserSchema } from './auth.schemas';
import { unwrapResponse } from '../common/common.utils';

export async function me(client: KyInstance): Promise<User | null> {
    const cookieStore = await cookies();

    const hasAuthCookie = cookieStore.has('access_token');

    if (!hasAuthCookie) {
        return null;
    }

    try {
        const raw = await client
            .get('auth/me', { throwHttpErrors: false })
            .json();

        // Handle explicit backend error codes when throwHttpErrors is false
        if (
            (raw as { statusCode: number })?.statusCode === 401 ||
            (raw as { statusCode: number })?.statusCode === 404
        ) {
            return null;
        }

        return unwrapResponse(UserSchema, raw);
    } catch {
        return null;
    }
}
