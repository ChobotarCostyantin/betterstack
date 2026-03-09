import { z } from 'zod';
import { UserSchema, type User } from '../users/users.shemas';

export type { User } from '../users/users.schema';
export { UserSchema } from '../users/users.schema';

export const RoleSchema = z.enum(['user', 'admin']);
export type Role = z.infer<typeof RoleSchema>;

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
