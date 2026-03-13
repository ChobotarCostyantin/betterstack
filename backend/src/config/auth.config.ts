import { registerAs, ConfigType } from '@nestjs/config';

export const authConfig = registerAs('auth', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const tokenExpiresInSec = parseInt(
        process.env.JWT_EXPIRES_IN_SEC ?? '86400',
        10,
    );

    return {
        cookieName: 'access-token',
        cookieOptions: {
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
            sameSite: (isProduction ? 'none' : 'lax') as
                | 'none'
                | 'lax'
                | 'strict',
            secure: isProduction,
            path: '/',
            maxAge: tokenExpiresInSec * 1000,
        },
        jwtSecret: process.env.JWT_SECRET!,
        expiresInSec: tokenExpiresInSec,
    };
});

export type AuthConfig = ConfigType<typeof authConfig>;
