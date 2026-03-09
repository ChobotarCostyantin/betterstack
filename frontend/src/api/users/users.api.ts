import { apiClient } from '../client';
import { unwrapResponse, unwrapPaginatedResponse } from '../utils';
import { UserSchema } from './users.schemas';
import type { User } from '../auth/auth.schemas';
import type { Paginated, PaginationQuery } from '../common.schemas';

export async function listUsers(
    query?: PaginationQuery,
): Promise<Paginated<User>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await apiClient.get('users', { searchParams }).json();
    return unwrapPaginatedResponse(UserSchema, raw);
}

export async function makeAdmin(userId: number): Promise<User> {
    const raw = await apiClient.patch(`users/${userId}/make-admin`).json();
    return unwrapResponse(UserSchema, raw);
}

export async function markSoftwareAsUsed(softwareId: number): Promise<void> {
    await apiClient.post(`users/software/${softwareId}/use`);
}

export async function markSoftwareAsUnused(softwareId: number): Promise<void> {
    await apiClient.delete(`users/software/${softwareId}/use`);
}
