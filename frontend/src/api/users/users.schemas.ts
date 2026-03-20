import { z } from 'zod';

export const IsUsedResponseSchema = z.object({ isUsed: z.boolean() });
export type IsUsedResponse = z.infer<typeof IsUsedResponseSchema>;

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

export const UpdateProfileInputSchema = z.object({
    fullName: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
