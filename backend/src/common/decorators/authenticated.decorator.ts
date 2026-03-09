import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Role } from '@common/enums/role.enum';
import { WithRole } from './roles.decorator';

export const Authenticated = (role: Role) =>
    applyDecorators(
        ApiCookieAuth(),
        UseGuards(JwtAuthGuard, RolesGuard),
        WithRole(role),
    );
