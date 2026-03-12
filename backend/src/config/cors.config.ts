import { registerAs, ConfigType } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
    origin: process.env.FRONTEND_URLS?.split(',') ?? [],
    credentials: true,
}));

export type CorsConfig = ConfigType<typeof corsConfig>;
