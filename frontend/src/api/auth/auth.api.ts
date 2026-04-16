import type { KyInstance } from 'ky';
import { unwrapResponse } from '../common/common.utils';
import {
    UserSchema,
    AuthPayloadSchema,
    type User,
    type RegisterInput,
    type LoginInput,
    type AuthResponse,
} from './auth.schemas';
import { cookies } from 'next/headers';

export async function register(
    client: KyInstance,
    input: RegisterInput,
): Promise<AuthResponse> {
    const raw = await client.post('auth/register', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function login(
    client: KyInstance,
    input: LoginInput,
): Promise<AuthResponse> {
    const raw = await client.post('auth/login', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function logout(client: KyInstance): Promise<void> {
    await client.post('auth/logout');
}

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
