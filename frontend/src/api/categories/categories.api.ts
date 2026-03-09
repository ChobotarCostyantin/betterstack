import { apiClient } from '../client';
import { unwrapResponse, unwrapPaginatedResponse } from '../utils';
import {
    CategoryListItemSchema,
    CategoryDetailSchema,
    type CategoryListItem,
    type CategoryDetail,
    type CreateCategoryInput,
    type RenameCategoryInput,
    type UpdateCategoryCriteriaInput,
} from './categories.schemas';
import type { Paginated, PaginationQuery } from '../common.schemas';

export async function listCategories(
    query?: PaginationQuery,
): Promise<Paginated<CategoryListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await apiClient.get('categories', { searchParams }).json();
    return unwrapPaginatedResponse(CategoryListItemSchema, raw);
}

export async function getCategoryById(id: number): Promise<CategoryDetail> {
    const raw = await apiClient.get(`categories/${id}`).json();
    return unwrapResponse(CategoryDetailSchema, raw);
}

export async function createCategory(
    input: CreateCategoryInput,
): Promise<CategoryListItem> {
    const raw = await apiClient.post('categories', { json: input }).json();
    return unwrapResponse(CategoryListItemSchema, raw);
}

export async function renameCategory(
    id: number,
    input: RenameCategoryInput,
): Promise<CategoryListItem> {
    const raw = await apiClient.put(`categories/${id}`, { json: input }).json();
    return unwrapResponse(CategoryListItemSchema, raw);
}

export async function updateCategoryCriteria(
    id: number,
    input: UpdateCategoryCriteriaInput,
): Promise<CategoryDetail> {
    const raw = await apiClient
        .put(`categories/${id}/criteria`, { json: input })
        .json();
    return unwrapResponse(CategoryDetailSchema, raw);
}

export async function deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`categories/${id}`);
}
