import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SoftwareUsage } from './entities/software-usage.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, SoftwareUsage])],
    controllers: [AuthController, UsersController],
    providers: [UsersRepository, UsersService],
})
export class UsersModule {}
