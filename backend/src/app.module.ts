import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { CriteriaModule } from './modules/criteria/criteria.module';
import { SoftwareModule } from './modules/software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { appConfig } from '@config/app.config';
import { adminConfig } from '@config/admin.config';
import { jwtConfig } from '@config/jwt.config';
import { postgresConfig } from '@config/postgres.config';
import { envValidationSchema } from '@config/env.validation';
import { loggerConfig } from '@config/logger.config';

@Module({
    imports: [
        LoggerModule.forRoot(loggerConfig),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development'],
            load: [appConfig, adminConfig, jwtConfig, postgresConfig],
            validationSchema: envValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            inject: [postgresConfig.KEY],
            useFactory: (postgres: ConfigType<typeof postgresConfig>) => ({
                type: 'postgres',
                host: postgres.host,
                port: postgres.port,
                username: postgres.username,
                password: postgres.password,
                database: postgres.dbName,
                autoLoadEntities: true,
                synchronize: false,
                retryAttempts: 5,
                retryDelay: 3000,
            }),
        }),
        JwtModule.registerAsync({
            inject: [jwtConfig.KEY],
            global: true,
            useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
                secret: jwt.secret,
                signOptions: { expiresIn: jwt.expiresInSec },
            }),
        }),
        EventEmitterModule.forRoot(),
        CategoriesModule,
        CriteriaModule,
        SoftwareModule,
        UsersModule,
    ],
})
export class AppModule {}
