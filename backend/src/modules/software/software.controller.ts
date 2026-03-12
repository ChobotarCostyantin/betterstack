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
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { ParseIdsPipe } from '@common/pipes/parse-ids.pipe';
import { SoftwareListItemDto } from './dto/software-response.dto';
import { SoftwareComparisonDto } from './dto/software-comparison.dto';
import { SoftwareQueryService } from './services/software-query.service';
import { SoftwareManagementService } from './services/software-management.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import {
    UpdateSoftwareDto,
    UpdateSoftwareFactorsDto,
    UpdateSoftwareMetricsDto,
} from './dto/update-software.dto';

@ApiTags('Software')
@Controller('software')
export class SoftwareController {
    constructor(
        private readonly queryService: SoftwareQueryService,
        private readonly managementService: SoftwareManagementService,
    ) {}

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
    @ApiQuery({
        name: 'categoryIds',
        required: false,
        description: 'Comma-separated category IDs to filter by',
        example: '1,2',
    })
    findAll(
        @Query('q') q?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
        @Query('categoryIds', new ParseIdsPipe()) categoryIds?: number[],
    ) {
        return this.queryService.findAll(q, page, perPage, categoryIds);
    }

    @Get('most-used')
    @ApiOperation({ summary: 'Get most-used software' })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    findMostUsed(
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    ) {
        return this.queryService.findMostUsed(limit);
    }

    @Get('compare')
    @ApiOperation({ summary: 'Compare two software items by slug' })
    @ApiOkResponse({ type: SoftwareComparisonDto })
    @ApiQuery({ name: 'a', required: true, description: 'Slug of software A' })
    @ApiQuery({ name: 'b', required: true, description: 'Slug of software B' })
    compare(@Query('a') slugA: string, @Query('b') slugB: string) {
        return this.queryService.compareBySlug(slugA, slugB);
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
        @Query('q') q?: string,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.queryService.findAlternatives(q, slug, page, perPage);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get software by slug' })
    findOneBySlug(@Param('slug') slug: string) {
        return this.queryService.findOneBySlug(slug);
    }

    @Post()
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Create new software' })
    create(@Body() dto: CreateSoftwareDto) {
        return this.managementService.create(dto);
    }

    @Put(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Update software' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareDto,
    ) {
        return this.managementService.update(id, dto);
    }

    @Put(':id/factors')
    @Authenticated(Role.ADMIN)
    @ApiOperation({
        summary:
            "Replace software's factors (must belong to software's categories)",
    })
    updateFactors(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareFactorsDto,
    ) {
        return this.managementService.updateFactors(id, dto);
    }

    @Put(':id/metrics')
    @Authenticated(Role.ADMIN)
    @ApiOperation({
        summary: "Replace software's metrics (all category metrics required)",
    })
    updateMetrics(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareMetricsDto,
    ) {
        return this.managementService.updateMetrics(id, dto);
    }

    @Delete(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Delete software' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.managementService.remove(id);
    }
}
