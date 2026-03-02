
import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
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
    constructor(private readonly usersService: UsersService) { }

    @Patch(':id/make-admin')
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Make user an Admin' })
    makeAdmin(@Param('id') id: string) {
        return this.usersService.makeAdmin(+id);
    }
}