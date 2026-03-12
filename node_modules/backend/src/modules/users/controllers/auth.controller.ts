import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { AuthDto } from '../dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    register(@Body() dto: AuthDto) {
        return this.usersService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login and get token' })
    login(@Body() dto: AuthDto) {
        return this.usersService.login(dto);
    }
}
