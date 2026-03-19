import { z } from 'zod';

export const RoleSchema = z.enum(['user', 'admin']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    fullName: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    githubUrl: z.string().url().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
    role: RoleSchema,
});
export type User = z.infer<typeof UserSchema>;

export const AuthPayloadSchema = z.object({ user: UserSchema });
export type AuthResponse = z.infer<typeof AuthPayloadSchema>;

export const RegisterInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
