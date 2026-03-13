import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
    unwrapSuccessResponse,
} from '../common/common.utils';
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
import type { Paginated } from '../common/common.types';

export async function listSoftware(
    client: KyInstance,
    query?: SoftwareListQuery,
): Promise<Paginated<SoftwareListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.q) searchParams.set('q', query.q);
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));
    if (query?.categoryIds?.length)
        searchParams.set('categoryIds', query.categoryIds.join(','));

    const raw = await client.get('software', { searchParams }).json();
    return unwrapPaginatedResponse(SoftwareListItemSchema, raw);
}

export async function getMostUsedSoftware(
    client: KyInstance,
    limit: number,
): Promise<SoftwareListItem[]> {
    const raw = await client
        .get('software/most-used', { searchParams: { limit: String(limit) } })
        .json();
    return unwrapResponse(SoftwareListItemSchema.array(), raw);
}

export async function compareSoftware(
    client: KyInstance,
    slugA: string,
    slugB: string,
): Promise<SoftwareComparison> {
    const raw = await client
        .get('software/compare', { searchParams: { a: slugA, b: slugB } })
        .json();
    return unwrapResponse(SoftwareComparisonSchema, raw);
}

export async function getSoftwareBySlug(
    client: KyInstance,
    slug: string,
): Promise<SoftwareDetail> {
    const raw = await client.get(`software/${slug}`).json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function getSoftwareAlternatives(
    client: KyInstance,
    slug: string,
    query?: { q?: string; page?: number; perPage?: number },
): Promise<Paginated<SoftwareListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.q) searchParams.set('q', query.q);
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client
        .get(`software/${slug}/alternatives`, { searchParams })
        .json();
    return unwrapPaginatedResponse(SoftwareListItemSchema, raw);
}

export async function createSoftware(
    client: KyInstance,
    input: CreateSoftwareInput,
): Promise<SoftwareDetail> {
    const raw = await client.post('software', { json: input }).json();
    return unwrapResponse(SoftwareDetailSchema, raw);
}

export async function updateSoftware(
    client: KyInstance,
    id: number,
    input: UpdateSoftwareInput,
): Promise<void> {
    const raw = await client.put(`software/${id}`, { json: input }).json();
    unwrapSuccessResponse(raw);
}

export async function updateSoftwareFactors(
    client: KyInstance,
    id: number,
    input: UpdateSoftwareFactorsInput,
): Promise<void> {
    const raw = await client
        .put(`software/${id}/factors`, { json: input })
        .json();
    unwrapSuccessResponse(raw);
}

export async function updateSoftwareMetrics(
    client: KyInstance,
    id: number,
    input: UpdateSoftwareMetricsInput,
): Promise<void> {
    const raw = await client
        .put(`software/${id}/metrics`, { json: input })
        .json();
    unwrapSuccessResponse(raw);
}

export async function deleteSoftware(
    client: KyInstance,
    id: number,
): Promise<void> {
    const raw = await client.delete(`software/${id}`).json();
    unwrapSuccessResponse(raw);
}
