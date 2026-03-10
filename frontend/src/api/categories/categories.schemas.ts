import { z } from 'zod';
import { FactorSchema, MetricSchema } from '../criteria/criteria.schemas';

export const CategoryListItemSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
});
export type CategoryListItem = z.infer<typeof CategoryListItemSchema>;

export const CategoryDetailSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    factors: z.array(FactorSchema),
    metrics: z.array(MetricSchema),
});
export type CategoryDetail = z.infer<typeof CategoryDetailSchema>;

export const CreateCategoryInputSchema = z.object({
    slug: z.string(),
    name: z.string(),
    factorIds: z.array(z.number()).optional(),
    metricIds: z.array(z.number()).optional(),
});
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;

export const RenameCategoryInputSchema = z.object({
    slug: z.string().optional(),
    name: z.string().optional(),
});
export type RenameCategoryInput = z.infer<typeof RenameCategoryInputSchema>;

export const UpdateCategoryCriteriaInputSchema = z.object({
    factorIds: z.array(z.number()),
    metricIds: z.array(z.number()),
});
export type UpdateCategoryCriteriaInput = z.infer<
    typeof UpdateCategoryCriteriaInputSchema
>;
