import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    API_PORT: Joi.number().port().default(3000),

    // Postgres
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_CA_CERT: Joi.string(),

    // JWT
    COOKIE_DOMAIN: Joi.string(),
    JWT_SECRET: Joi.string().min(10).required(),
    JWT_EXPIRES_IN_SEC: Joi.number().default(86400),

    // Admin seed
    ADMIN_EMAIL: Joi.string().email().required(),
    ADMIN_PASSWORD: Joi.string().min(8).required(),

    // CORS
    FRONTEND_URLS: Joi.string().uri().default('http://localhost:3000'),
});
