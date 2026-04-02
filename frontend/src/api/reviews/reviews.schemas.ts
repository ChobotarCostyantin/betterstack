import { z } from 'zod';
import { AuthorDetailsSchema } from '../users/users.schemas';

export const SoftwareReviewResponseSchema = z.object({
    id: z.number(),
    content: z.string(),
    author: AuthorDetailsSchema,
});
export type SoftwareReviewResponse = z.infer<
    typeof SoftwareReviewResponseSchema
>;

export const CreateSoftwareReviewInputSchema = z.object({
    softwareSlug: z.string(),
    content: z.string(),
});
export type CreateSoftwareReviewInput = z.infer<
    typeof CreateSoftwareReviewInputSchema
>;

export const UpdateSoftwareReviewInputSchema = z.object({
    content: z.string().optional(),
});
export type UpdateSoftwareReviewInput = z.infer<
    typeof UpdateSoftwareReviewInputSchema
>;

export const CreateSoftwareComparisonReviewInputSchema = z.object({
    softwareSlugA: z.string(),
    softwareSlugB: z.string(),
    content: z.string(),
});
export type CreateSoftwareComparisonReviewInput = z.infer<
    typeof CreateSoftwareComparisonReviewInputSchema
>;

export const UpdateSoftwareComparisonReviewInputSchema = z.object({
    content: z.string().optional(),
});
export type UpdateSoftwareComparisonReviewInput = z.infer<
    typeof UpdateSoftwareComparisonReviewInputSchema
>;
