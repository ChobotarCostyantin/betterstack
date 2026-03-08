import {
    Controller,
    Patch,
    Post,
    Delete,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { Role } from 'src/common/enums/role.enum';
import { WithRole } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch(':id/make-admin')
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Make user an Admin' })
    makeAdmin(@Param('id') id: string) {
        return this.usersService.makeAdmin(+id);
    }

    @Post(':userId/software/:softwareId/use')
    @WithRole(Role.USER)
    @ApiOperation({
        summary: 'Mark a software as used by the user',
    })
    markAsUsed(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markAsUsed(userId, softwareId);
    }

    @Delete(':userId/software/:softwareId/use')
    @WithRole(Role.USER)
    @ApiOperation({ summary: "Remove a software from the user's used list" })
    markAsUnused(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markAsUnused(userId, softwareId);
    }
}
