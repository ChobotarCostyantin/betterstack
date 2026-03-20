import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
    unwrapSuccessResponse,
} from '../common/common.utils';
import { type User, UserSchema } from '../auth/auth.schemas';
import type { Paginated, PaginationQuery } from '../common/common.types';
import { IsUsedResponseSchema, type IsUsedResponse } from './users.schemas';

export async function listUsers(
    client: KyInstance,
    query?: PaginationQuery,
): Promise<Paginated<User>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client.get('users', { searchParams }).json();
    return unwrapPaginatedResponse(UserSchema, raw);
}

export async function getUserById(
    client: KyInstance,
    userId: number,
): Promise<User> {
    const raw = await client.get(`users/${userId}`).json();
    return unwrapResponse(UserSchema, raw);
}

export async function makeAdmin(
    client: KyInstance,
    userId: number,
): Promise<User> {
    const raw = await client.patch(`users/${userId}/make-admin`).json();
    return unwrapResponse(UserSchema, raw);
}

export async function markSoftwareAsUsed(
    client: KyInstance,
    softwareId: number,
): Promise<void> {
    const raw = await client.post(`users/software/${softwareId}/use`).json();
    unwrapSuccessResponse(raw);
}

export async function markSoftwareAsUnused(
    client: KyInstance,
    softwareId: number,
): Promise<void> {
    const raw = await client.delete(`users/software/${softwareId}/use`).json();
    unwrapSuccessResponse(raw);
}

export async function hasUserUsedSoftware(
    client: KyInstance,
    softwareId: number,
): Promise<IsUsedResponse> {
    const raw = await client
        .get(`users/software/has-used/${softwareId}`)
        .json();
    return unwrapResponse(IsUsedResponseSchema, raw);
}
