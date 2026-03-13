import { z } from 'zod';

export const IsUsedResponseSchema = z.object({ isUsed: z.boolean() });
export type IsUsedResponse = z.infer<typeof IsUsedResponseSchema>;
