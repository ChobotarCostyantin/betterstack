import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
    cookieName: 'access_token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: parseInt(process.env.JWT_EXPIRES_IN_SEC ?? '86400', 10) * 1000,
    },
    jwtSecret: process.env.JWT_SECRET!,
    expiresInSec: parseInt(process.env.JWT_EXPIRES_IN_SEC ?? '86400', 10),
}));
