import { registerAs, ConfigType } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
}));

export type CorsConfig = ConfigType<typeof corsConfig>;
