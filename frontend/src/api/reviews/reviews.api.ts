import type { KyInstance } from 'ky';
import {
    SoftwareReviewResponseSchema,
    type SoftwareReviewResponse,
    type CreateSoftwareReviewInput,
    type UpdateSoftwareReviewInput,
    type CreateSoftwareComparisonReviewInput,
    type UpdateSoftwareComparisonReviewInput,
} from './reviews.schemas';
import { unwrapResponse, unwrapSuccessResponse } from '../common/common.utils';

export async function getSoftwareReviewBySlug(
    client: KyInstance,
    slug: string,
): Promise<SoftwareReviewResponse> {
    const raw = await client.get(`reviews/software/${slug}`).json();
    return unwrapResponse(SoftwareReviewResponseSchema, raw);
}

export async function createSoftwareReview(
    client: KyInstance,
    input: CreateSoftwareReviewInput,
): Promise<SoftwareReviewResponse> {
    const raw = await client.post('reviews/software', { json: input }).json();
    return unwrapResponse(SoftwareReviewResponseSchema, raw);
}

export async function updateSoftwareReview(
    client: KyInstance,
    id: number,
    input: UpdateSoftwareReviewInput,
): Promise<void> {
    const raw = await client
        .put(`reviews/software/${id}`, { json: input })
        .json();
    unwrapSuccessResponse(raw);
}

export async function deleteSoftwareReview(
    client: KyInstance,
    id: number,
): Promise<void> {
    const raw = await client.delete(`reviews/software/${id}`).json();
    unwrapSuccessResponse(raw);
}

export async function getSoftwareComparisonReview(
    client: KyInstance,
    slugA: string,
    slugB: string,
): Promise<SoftwareReviewResponse> {
    const raw = await client
        .get('reviews/comparison', { searchParams: { slugA, slugB } })
        .json();
    return unwrapResponse(SoftwareReviewResponseSchema, raw);
}

export async function createSoftwareComparisonReview(
    client: KyInstance,
    input: CreateSoftwareComparisonReviewInput,
): Promise<SoftwareReviewResponse> {
    const raw = await client.post('reviews/comparison', { json: input }).json();
    return unwrapResponse(SoftwareReviewResponseSchema, raw);
}

export async function updateSoftwareComparisonReview(
    client: KyInstance,
    id: number,
    input: UpdateSoftwareComparisonReviewInput,
): Promise<void> {
    const raw = await client
        .put(`reviews/comparison/${id}`, { json: input })
        .json();
    unwrapSuccessResponse(raw);
}

export async function deleteSoftwareComparisonReview(
    client: KyInstance,
    id: number,
): Promise<void> {
    const raw = await client.delete(`reviews/comparison/${id}`).json();
    unwrapSuccessResponse(raw);
}
