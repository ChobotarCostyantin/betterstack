import {
    Controller,
    Post,
    Get,
    Body,
    Res,
    Req,
    HttpCode,
    HttpStatus,
    UseGuards,
    Inject,
} from '@nestjs/common';
import type { Response } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiCookieAuth,
} from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';
import { UserDto } from '../dto/user.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '@common/interfaces/jwt-payload.interface';
import { authConfig, type AuthConfig } from '@config/auth.config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(authConfig.KEY)
        private readonly auth: AuthConfig,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiCreatedResponse({ type: AuthResponseDto })
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const { token, user } = await this.usersService.register(dto);
        res.cookie(this.auth.cookieName, token, this.auth.cookieOptions);
        return { user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login' })
    @ApiOkResponse({ type: AuthResponseDto })
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const { token, user } = await this.usersService.login(dto);
        res.cookie(this.auth.cookieName, token, this.auth.cookieOptions);
        return { user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Logout — clears the auth cookie' })
    logout(@Res({ passthrough: true }) res: Response): void {
        res.clearCookie(this.auth.cookieName, this.auth.cookieOptions);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Return the currently authenticated user' })
    @ApiOkResponse({ type: UserDto })
    me(@Req() req: AuthenticatedRequest): UserDto {
        const { id, email, role } = req.user;
        const dto = new UserDto();
        dto.id = id;
        dto.email = email;
        dto.role = role;
        return dto;
    }
}
