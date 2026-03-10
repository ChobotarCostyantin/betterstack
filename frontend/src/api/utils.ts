import { z } from 'zod';
import { responseOf, paginatedResponseOf } from './common.schemas';
import type { Paginated } from './common.schemas';

export function unwrapResponse<T extends z.ZodTypeAny>(
    schema: T,
    raw: unknown,
): z.infer<T> {
    return (responseOf(schema).parse(raw) as { data: z.infer<T> }).data;
}

export function unwrapPaginatedResponse<T extends z.ZodTypeAny>(
    schema: T,
    raw: unknown,
): Paginated<z.infer<T>> {
    return paginatedResponseOf(schema).parse(raw).data as Paginated<z.infer<T>>;
}
