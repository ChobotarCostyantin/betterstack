import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { CriteriaModule } from './modules/criteria/criteria.module';
import { SoftwareModule } from './modules/software/software.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'betterstack_db',
            autoLoadEntities: true,
            synchronize: true,
        }),
        JwtModule.register({
            global: true,
            secret: 'super-secret-key', // TODO: move to env
            signOptions: { expiresIn: '1d' },
        }),
        EventEmitterModule.forRoot(),

        CategoriesModule,
        CriteriaModule,
        SoftwareModule,
        UsersModule,
    ],
})
export class AppModule {}
