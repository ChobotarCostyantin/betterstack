import { z } from 'zod';
import { PaginatedMetaSchema } from './common.schemas';
import type { Paginated } from './common.types';

function responseOf<T extends z.ZodTypeAny>(schema: T) {
    return z.object({ data: schema });
}

function paginatedResponseOf<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        data: z.array(itemSchema),
        meta: PaginatedMetaSchema,
    });
}

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
    return paginatedResponseOf(schema).parse(raw) as Paginated<z.infer<T>>;
}
