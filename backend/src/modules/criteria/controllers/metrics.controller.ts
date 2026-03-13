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
    ApiQuery,
    ApiOkResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { DataOf, DataArrayOf } from '@common/dto/response.dto';
import { SuccessResponseDto } from '@common/dto/success-response.dto';
import { ParseIdsPipe } from '@common/pipes/parse-ids.pipe';
import { MetricsService } from '../services/metrics.service';
import { CreateMetricDto } from '../dto/create-metric.dto';
import { UpdateMetricDto } from '../dto/update-metric.dto';
import { MetricDto } from '../dto/metric-response.dto';

@ApiTags('Criteria')
@Controller('criteria/metrics')
export class MetricsController {
    constructor(private readonly service: MetricsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all metrics (paginated)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'perPage', required: false, example: 10 })
    @ApiOkResponse({ type: PaginatedOf(MetricDto) })
    findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.service.findAllPaginated(page, perPage);
    }

    @Get('by-categories')
    @ApiOperation({ summary: 'Get metrics belonging to given category IDs' })
    @ApiQuery({
        name: 'categoryIds',
        required: true,
        description: 'Comma-separated category IDs',
        example: '1,2',
    })
    @ApiOkResponse({ type: DataArrayOf(MetricDto) })
    findByCategories(
        @Query('categoryIds', new ParseIdsPipe({ required: true }))
        ids: number[],
    ) {
        return this.service.findByCategories(ids);
    }

    @Post()
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new metric' })
    @ApiCreatedResponse({ type: DataOf(MetricDto) })
    create(@Body() dto: CreateMetricDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Update a metric' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMetricDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a metric' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
