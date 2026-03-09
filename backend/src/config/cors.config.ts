import { registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
}));
