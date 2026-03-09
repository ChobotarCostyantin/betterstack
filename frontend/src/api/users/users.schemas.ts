export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    role: RoleSchema,
});
export type User = z.infer<typeof UserSchema>;
