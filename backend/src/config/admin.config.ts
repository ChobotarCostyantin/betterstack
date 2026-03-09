import { registerAs, ConfigType } from '@nestjs/config';

export const adminConfig = registerAs('admin', () => ({
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
}));

export type AdminConfig = ConfigType<typeof adminConfig>;
