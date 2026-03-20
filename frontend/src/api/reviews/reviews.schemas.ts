import { z } from 'zod';

export const AuthorDetailsSchema = z.object({
    id: z.number(),
    userId: z.number(),
    fullName: z.string(),
    bio: z.string(),
    avatarUrl: z.string().nullable(),
    websiteUrl: z.string().nullable(),
});
export type AuthorDetails = z.infer<typeof AuthorDetailsSchema>;

export const AuthorDetailsWithUserSchema = AuthorDetailsSchema.extend({
    userEmail: z.string(),
    userRole: z.string(),
});
export type AuthorDetailsWithUser = z.infer<typeof AuthorDetailsWithUserSchema>;

export const UpdateAuthorDetailsInputSchema = z.object({
    fullName: z.string(),
    bio: z.string(),
    avatarUrl: z.string().nullable(),
    websiteUrl: z.string().nullable(),
});
export type UpdateAuthorDetailsInput = z.infer<
    typeof UpdateAuthorDetailsInputSchema
>;

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
