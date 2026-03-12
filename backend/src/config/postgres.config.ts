import { registerAs, ConfigType } from '@nestjs/config';

export const postgresConfig = registerAs('postgres', () => ({
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    dbName: process.env.POSTGRES_DB!,
    sslOptions:
        process.env.NODE_ENV === 'production'
            ? {
                  rejectUnauthorized: false,
                  ca: process.env.POSTGRES_CA_CERT,
              }
            : false,
}));

export type PostgresConfig = ConfigType<typeof postgresConfig>;
