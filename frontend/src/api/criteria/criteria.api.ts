import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
} from '../common/common.utils';
import {
    FactorSchema,
    MetricSchema,
    type Factor,
    type Metric,
    type CreateFactorInput,
    type UpdateFactorInput,
    type CreateMetricInput,
    type UpdateMetricInput,
} from './criteria.schemas';
import type { Paginated, PaginationQuery } from '../common/common.types';

export async function listFactors(
    client: KyInstance,
    query?: PaginationQuery,
): Promise<Paginated<Factor>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client.get('criteria/factors', { searchParams }).json();
    return unwrapPaginatedResponse(FactorSchema, raw);
}

export async function listFactorsByCategories(
    client: KyInstance,
    categoryIds: [number, ...number[]],
): Promise<Factor[]> {
    const raw = await client
        .get('criteria/factors/by-categories', {
            searchParams: { categoryIds: categoryIds.join(',') },
        })
        .json();
    return unwrapResponse(FactorSchema.array(), raw);
}

export async function createFactor(
    client: KyInstance,
    input: CreateFactorInput,
): Promise<Factor> {
    const raw = await client.post('criteria/factors', { json: input }).json();
    return unwrapResponse(FactorSchema, raw);
}

export async function updateFactor(
    client: KyInstance,
    id: number,
    input: UpdateFactorInput,
): Promise<void> {
    await client.put(`criteria/factors/${id}`, { json: input });
}

export async function deleteFactor(
    client: KyInstance,
    id: number,
): Promise<void> {
    await client.delete(`criteria/factors/${id}`);
}

export async function listMetrics(
    client: KyInstance,
    query?: PaginationQuery,
): Promise<Paginated<Metric>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client.get('criteria/metrics', { searchParams }).json();
    return unwrapPaginatedResponse(MetricSchema, raw);
}

export async function listMetricsByCategories(
    client: KyInstance,
    categoryIds: number[],
): Promise<Metric[]> {
    const raw = await client
        .get('criteria/metrics/by-categories', {
            searchParams: { categoryIds: categoryIds.join(',') },
        })
        .json();
    return unwrapResponse(MetricSchema.array(), raw);
}

export async function createMetric(
    client: KyInstance,
    input: CreateMetricInput,
): Promise<Metric> {
    const raw = await client.post('criteria/metrics', { json: input }).json();
    return unwrapResponse(MetricSchema, raw);
}

export async function updateMetric(
    client: KyInstance,
    id: number,
    input: UpdateMetricInput,
): Promise<void> {
    await client.put(`criteria/metrics/${id}`, { json: input });
}

export async function deleteMetric(
    client: KyInstance,
    id: number,
): Promise<void> {
    await client.delete(`criteria/metrics/${id}`);
}
