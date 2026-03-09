import { apiClient } from '../client';
import { unwrapResponse, unwrapPaginatedResponse } from '../utils';
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
import type { Paginated, PaginationQuery } from '../common.schemas';

export async function listFactors(
    query?: PaginationQuery,
): Promise<Paginated<Factor>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await apiClient
        .get('criteria/factors', { searchParams })
        .json();
    return unwrapPaginatedResponse(FactorSchema, raw);
}

export async function listFactorsByCategories(
    categoryIds: [number, ...number[]],
): Promise<Factor[]> {
    const raw = await apiClient
        .get('criteria/factors/by-categories', {
            searchParams: { categoryIds: categoryIds.join(',') },
        })
        .json();
    return unwrapResponse(FactorSchema.array(), raw);
}

export async function createFactor(input: CreateFactorInput): Promise<Factor> {
    const raw = await apiClient
        .post('criteria/factors', { json: input })
        .json();
    return unwrapResponse(FactorSchema, raw);
}

export async function updateFactor(
    id: number,
    input: UpdateFactorInput,
): Promise<Factor> {
    const raw = await apiClient
        .put(`criteria/factors/${id}`, { json: input })
        .json();
    return unwrapResponse(FactorSchema, raw);
}

export async function deleteFactor(id: number): Promise<void> {
    await apiClient.delete(`criteria/factors/${id}`);
}

export async function listMetrics(
    query?: PaginationQuery,
): Promise<Paginated<Metric>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await apiClient
        .get('criteria/metrics', { searchParams })
        .json();
    return unwrapPaginatedResponse(MetricSchema, raw);
}

export async function listMetricsByCategories(
    categoryIds: number[],
): Promise<Metric[]> {
    const raw = await apiClient
        .get('criteria/metrics/by-categories', {
            searchParams: { categoryIds: categoryIds.join(',') },
        })
        .json();
    return unwrapResponse(MetricSchema.array(), raw);
}

export async function createMetric(input: CreateMetricInput): Promise<Metric> {
    const raw = await apiClient
        .post('criteria/metrics', { json: input })
        .json();
    return unwrapResponse(MetricSchema, raw);
}

export async function updateMetric(
    id: number,
    input: UpdateMetricInput,
): Promise<Metric> {
    const raw = await apiClient
        .put(`criteria/metrics/${id}`, { json: input })
        .json();
    return unwrapResponse(MetricSchema, raw);
}

export async function deleteMetric(id: number): Promise<void> {
    await apiClient.delete(`criteria/metrics/${id}`);
}
