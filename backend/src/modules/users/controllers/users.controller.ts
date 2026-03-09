import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiOkResponse,
} from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { WithRole } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { UsersService } from '../users.service';
import { UserDto } from '../dto/user.dto';
import type { AuthenticatedRequest } from '@common/interfaces/jwt-payload.interface';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Get paginated list of users (admin only)' })
    findAll(@Query() query: PaginationQueryDto) {
        return this.usersService.findAll(query);
    }

    @Patch(':id/make-admin')
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Promote a user to admin (admin only)' })
    @ApiOkResponse({ type: UserDto })
    makeAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.makeAdmin(id);
    }

    @Post('software/:softwareId/use')
    @WithRole(Role.USER)
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
    @WithRole(Role.USER)
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
