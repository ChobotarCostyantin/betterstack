import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET!,
    expiresInSec: parseInt(process.env.JWT_EXPIRES_IN_SEC ?? '86400', 10),
}));
