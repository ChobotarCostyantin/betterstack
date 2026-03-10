import { z } from 'zod';

export const PaginationQuerySchema = z.object({
    page: z.number().int().positive().optional(),
    perPage: z.number().int().positive().optional(),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginatedMetaSchema = z.object({
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
    totalPages: z.number(),
});
export type PaginatedMeta = z.infer<typeof PaginatedMetaSchema>;

export function responseOf<T extends z.ZodTypeAny>(schema: T) {
    return z.object({ data: schema });
}

export function paginatedResponseOf<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        data: z.object({
            data: z.array(itemSchema),
            meta: PaginatedMetaSchema,
        }),
    });
}

export type Paginated<T> = {
    data: T[];
    meta: PaginatedMeta;
};
