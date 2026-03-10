import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
} from '../common/common.utils';
import { type User, UserSchema } from '../auth/auth.schemas';
import type { Paginated, PaginationQuery } from '../common/common.types';

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
    await client.post(`users/software/${softwareId}/use`);
}

export async function markSoftwareAsUnused(
    client: KyInstance,
    softwareId: number,
): Promise<void> {
    await client.delete(`users/software/${softwareId}/use`);
}
