import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
} from '../common/common.utils';
import {
    CategoryListItemSchema,
    CategoryDetailSchema,
    type CategoryListItem,
    type CategoryDetail,
    type CreateCategoryInput,
    type RenameCategoryInput,
    type UpdateCategoryCriteriaInput,
} from './categories.schemas';
import type { Paginated, PaginationQuery } from '../common/common.types';

export async function listCategories(
    client: KyInstance,
    query?: PaginationQuery,
): Promise<Paginated<CategoryListItem>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client.get('categories', { searchParams }).json();
    return unwrapPaginatedResponse(CategoryListItemSchema, raw);
}

export async function getCategoryById(
    client: KyInstance,
    id: number,
): Promise<CategoryDetail> {
    const raw = await client.get(`categories/${id}`).json();
    return unwrapResponse(CategoryDetailSchema, raw);
}

export async function getCategoryBySlug(
    client: KyInstance,
    slug: string,
): Promise<CategoryDetail> {
    const raw = await client.get(`categories/slug/${slug}`).json();
    return unwrapResponse(CategoryDetailSchema, raw);
}

export async function createCategory(
    client: KyInstance,
    input: CreateCategoryInput,
): Promise<CategoryListItem> {
    const raw = await client.post('categories', { json: input }).json();
    return unwrapResponse(CategoryListItemSchema, raw);
}

export async function renameCategory(
    client: KyInstance,
    id: number,
    input: RenameCategoryInput,
): Promise<CategoryListItem> {
    const raw = await client.put(`categories/${id}`, { json: input }).json();
    return unwrapResponse(CategoryListItemSchema, raw);
}

export async function updateCategoryCriteria(
    client: KyInstance,
    id: number,
    input: UpdateCategoryCriteriaInput,
): Promise<CategoryDetail> {
    const raw = await client
        .put(`categories/${id}/criteria`, { json: input })
        .json();
    return unwrapResponse(CategoryDetailSchema, raw);
}

export async function deleteCategory(
    client: KyInstance,
    id: number,
): Promise<void> {
    await client.delete(`categories/${id}`);
}
