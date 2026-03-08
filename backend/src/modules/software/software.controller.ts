import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { WithRole } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';

@ApiTags('Software')
@Controller('software')
@ApiBearerAuth()
export class SoftwareController {
    constructor(private readonly service: SoftwareService) {}

    @Get()
    @ApiOperation({ summary: 'Get all software' })
    findAll() {
        return this.service.findAll();
    }

    @Get('id/:id')
    @ApiOperation({ summary: 'Get software by id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get software by slug' })
    findOneBySlug(@Param('slug') slug: string) {
        return this.service.findOneBySlug(slug);
    }

    @Post()
    @ApiOperation({ summary: 'Create new software' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.USER)
    create(@Body() dto: CreateSoftwareDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update software' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete software' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
