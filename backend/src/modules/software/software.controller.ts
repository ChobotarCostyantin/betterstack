import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { SoftwareListItemDto } from './dto/software-response.dto';
import { SoftwareComparisonDto } from './dto/software-comparison.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { WithRole } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';

@ApiTags('Software')
@Controller('software')
export class SoftwareController {
    constructor(private readonly service: SoftwareService) {}

    @Get()
    @ApiOperation({ summary: 'Get all software (paginated, searchable)' })
    @ApiOkResponse({ type: PaginatedOf(SoftwareListItemDto) })
    @ApiQuery({
        name: 'q',
        required: false,
        description: 'Search by name or description',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'perPage', required: false, example: 10 })
    findAll(
        @Query('q') q?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.service.findAll(q, page, perPage);
    }

    @Get('most-used')
    @ApiOperation({ summary: 'Get most-used software' })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    findMostUsed(
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    ) {
        return this.service.findMostUsed(limit);
    }

    @Get('compare')
    @ApiOperation({
        summary: 'Compare two software items by slug (USER+ role required)',
    })
    @ApiOkResponse({ type: SoftwareComparisonDto })
    @ApiQuery({ name: 'a', required: true, description: 'Slug of software A' })
    @ApiQuery({ name: 'b', required: true, description: 'Slug of software B' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.USER)
    compare(@Query('a') slugA: string, @Query('b') slugB: string) {
        return this.service.compareBySlug(slugA, slugB);
    }

    @Get(':slug/alternatives')
    @ApiOperation({
        summary: 'Get alternative software sharing at least 1 category',
    })
    @ApiOkResponse({ type: PaginatedOf(SoftwareListItemDto) })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'perPage', required: false, example: 10 })
    findAlternatives(
        @Param('slug') slug: string,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.service.findAlternatives(slug, page, perPage);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get software by slug' })
    findOneBySlug(@Param('slug') slug: string) {
        return this.service.findOneBySlug(slug);
    }

    @Post()
    @ApiOperation({ summary: 'Create new software' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    create(@Body() dto: CreateSoftwareDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update software' })
    @ApiBearerAuth()
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
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
