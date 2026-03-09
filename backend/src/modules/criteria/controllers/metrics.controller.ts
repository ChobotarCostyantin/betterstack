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
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { WithRole } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { MetricsService } from '../services/metrics.service';
import { CreateMetricDto } from '../dto/create-metric.dto';
import { UpdateMetricDto } from '../dto/update-metric.dto';

@ApiTags('Criteria')
@Controller('criteria/metrics')
export class MetricsController {
    constructor(private readonly service: MetricsService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all metrics, optionally filtered by category IDs',
    })
    @ApiQuery({
        name: 'categoryIds',
        required: false,
        description: 'Comma-separated category IDs',
        example: '1,2',
    })
    findAll(@Query('categoryIds') categoryIds?: string) {
        const ids = categoryIds
            ? categoryIds
                  .split(',')
                  .map((id) => parseInt(id.trim(), 10))
                  .filter((id) => !isNaN(id))
            : undefined;
        return this.service.findAll(ids);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new metric' })
    create(@Body() dto: CreateMetricDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Update a metric' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMetricDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a metric' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
