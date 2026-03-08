import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { SoftwareUsage } from './entities/software-usage.entity';
import { UsersService } from './users.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { JwtStrategy } from '@common/strategies/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User, SoftwareUsage]), PassportModule],
    controllers: [AuthController, UsersController],
    providers: [UsersService, JwtStrategy],
})
export class UsersModule {}
