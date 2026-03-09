import { apiClient } from '../client';
import { unwrapResponse } from '../utils';
import {
    AuthPayloadSchema,
    UserSchema,
    type RegisterInput,
    type LoginInput,
    type AuthResponse,
    type User,
} from './auth.schemas';

export async function register(input: RegisterInput): Promise<AuthResponse> {
    const raw = await apiClient.post('auth/register', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
    const raw = await apiClient.post('auth/login', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function logout(): Promise<void> {
    await apiClient.post('auth/logout');
}

export async function me(): Promise<User> {
    const raw = await apiClient.get('auth/me').json();
    return unwrapResponse(UserSchema, raw);
}
