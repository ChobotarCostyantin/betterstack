import { registerAs, ConfigType } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
}));

export type CorsConfig = ConfigType<typeof corsConfig>;
