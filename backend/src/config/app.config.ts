import { registerAs, ConfigType } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
}));

export type AppConfig = ConfigType<typeof appConfig>;
