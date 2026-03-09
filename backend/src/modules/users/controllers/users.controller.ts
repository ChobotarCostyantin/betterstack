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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { UsersService } from '../users.service';
import { UserDto } from '../dto/user.dto';
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

    @Patch(':id/make-admin')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Promote a user to admin (admin only)' })
    @ApiOkResponse({ type: UserDto })
    makeAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.makeAdmin(id);
    }

    @Post('software/:softwareId/use')
    @Authenticated()
    @ApiOperation({
        summary: 'Mark a software as used by the authenticated user',
    })
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
    markAsUnused(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markSoftwareAsUnused(req.user.id, softwareId);
    }
}
