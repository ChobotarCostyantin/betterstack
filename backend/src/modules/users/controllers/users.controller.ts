import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Param,
    Query,
    ParseIntPipe,
    Req,
    Body,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { DataOf } from '@common/dto/response.dto';
import { SuccessResponseDto } from '@common/dto/success-response.dto';
import { IsUsedResponseDto } from '../dto/is-used-response.dto';
import { UsersService } from '../users.service';
import { UserDto, UpdateUserRoleDto } from '../dto/user.dto';
import type { AuthenticatedRequest } from '@common/interfaces/jwt-payload.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Get paginated list of users (admin only)' })
    @ApiOkResponse({ type: PaginatedOf(UserDto) })
    findAll(@Query() query: PaginationQueryDto) {
        return this.usersService.findAll(query);
    }

    @Patch(':id/role')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Update user role (admin only)' })
    @ApiOkResponse({ type: DataOf(UserDto) })
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserRoleDto,
    ) {
        return this.usersService.updateRole(id, dto.role);
    }

    @Get('software/has-used/:softwareId')
    @Authenticated()
    @ApiOperation({
        summary:
            'Get whether a software is used by the authenticated user or not',
    })
    @ApiOkResponse({ type: DataOf(IsUsedResponseDto) })
    hasUsed(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.hasUserUsedSoftware(req.user.id, softwareId);
    }

    @Post('software/:softwareId/use')
    @Authenticated()
    @ApiOperation({
        summary: 'Mark a software as used by the authenticated user',
    })
    @ApiCreatedResponse({ type: DataOf(SuccessResponseDto) })
    markAsUsed(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markSoftwareAsUsed(req.user.id, softwareId);
    }

    @Delete('software/:softwareId/use')
    @Authenticated()
    @ApiOperation({
        summary: "Remove a software from the authenticated user's used list",
    })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    markAsUnused(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markSoftwareAsUnused(req.user.id, softwareId);
    }
}
