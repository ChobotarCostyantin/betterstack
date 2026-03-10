import { apiClient } from '../client';
import { unwrapResponse, unwrapPaginatedResponse } from '../utils';
import {
    SoftwareListItemSchema,
    SoftwareDetailSchema,
    SoftwareComparisonSchema,
    type SoftwareListItem,
    type SoftwareDetail,
    type SoftwareComparison,
    type SoftwareListQuery,
    type CreateSoftwareInput,
    type UpdateSoftwareInput,
    type UpdateSoftwareFactorsInput,
    type UpdateSoftwareMetricsInput,
} from './software.schemas';
import type { Paginated } from '../common.schemas';

export async function listSoftware(
    query?: SoftwareListQuery,
): Promise<Paginated<SoftwareListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.q) searchParams.set('q', query.q);
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));
    if (query?.categoryIds?.length)
        searchParams.set('categoryIds', query.categoryIds.join(','));

    const raw = await apiClient.get('software', { searchParams }).json();
    return unwrapPaginatedResponse(SoftwareListItemSchema, raw);
}

export async function getMostUsedSoftware(
    limit: number,
): Promise<SoftwareListItem[]> {
    const searchParams = new URLSearchParams();
    searchParams.set('limit', String(limit));

    const raw = await apiClient
        .get('software/most-used', { searchParams })
        .json();
    return unwrapResponse(SoftwareListItemSchema.array(), raw);
}

export async function compareSoftware(
    slugA: string,
    slugB: string,
): Promise<SoftwareComparison> {
    const raw = await apiClient
        .get('software/compare', { searchParams: { a: slugA, b: slugB } })
        .json();
    return unwrapResponse(SoftwareComparisonSchema, raw);
}

export async function getSoftwareBySlug(slug: string): Promise<SoftwareDetail> {
    const raw = await apiClient.get(`software/${slug}`).json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function getSoftwareAlternatives(
    slug: string,
    query?: { page?: number; perPage?: number },
): Promise<Paginated<SoftwareListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await apiClient
        .get(`software/${slug}/alternatives`, { searchParams })
        .json();
    return unwrapPaginatedResponse(SoftwareListItemSchema, raw);
}

export async function createSoftware(
    input: CreateSoftwareInput,
): Promise<SoftwareDetail> {
    const raw = await apiClient.post('software', { json: input }).json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function updateSoftware(
    id: number,
    input: UpdateSoftwareInput,
): Promise<SoftwareDetail> {
    const raw = await apiClient.put(`software/${id}`, { json: input }).json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function updateSoftwareFactors(
    id: number,
    input: UpdateSoftwareFactorsInput,
): Promise<SoftwareDetail> {
    const raw = await apiClient
        .put(`software/${id}/factors`, { json: input })
        .json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function updateSoftwareMetrics(
    id: number,
    input: UpdateSoftwareMetricsInput,
): Promise<SoftwareDetail> {
    const raw = await apiClient
        .put(`software/${id}/metrics`, { json: input })
        .json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function deleteSoftware(id: number): Promise<void> {
    await apiClient.delete(`software/${id}`);
}
