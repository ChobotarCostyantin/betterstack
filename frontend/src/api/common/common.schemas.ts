import { z } from 'zod';
import type { PaginatedMeta, PaginationQuery } from './common.types';

export const PaginatedMetaSchema: z.ZodType<PaginatedMeta> = z.object({
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
    totalPages: z.number(),
});

export const PaginationQuerySchema: z.ZodType<PaginationQuery> = z.object({
    page: z.number().int().positive().optional(),
    perPage: z.number().int().positive().optional(),
});

export const SuccessResponseSchema = z.object({ success: z.literal(true) });
