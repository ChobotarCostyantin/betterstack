import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { AuthResponseDto } from '../dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiCreatedResponse({ type: AuthResponseDto })
    register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.usersService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login and obtain a JWT token' })
    @ApiOkResponse({ type: AuthResponseDto })
    login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.usersService.login(dto);
    }
}
