import type { KyInstance } from 'ky';
import { unwrapResponse } from '../common/common.utils';
import {
    AuthPayloadSchema,
    type RegisterInput,
    type LoginInput,
    type AuthResponse,
} from './auth.schemas';

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
