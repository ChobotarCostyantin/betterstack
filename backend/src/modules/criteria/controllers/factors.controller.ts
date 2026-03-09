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
    ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { WithRole } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { ParseIdsPipe } from '@common/pipes/parse-ids.pipe';
import { FactorsService } from '../services/factors.service';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';
import { FactorDto } from '../dto/factor-response.dto';

@ApiTags('Criteria')
@Controller('criteria/factors')
export class FactorsController {
    constructor(private readonly service: FactorsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all factors (paginated)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'perPage', required: false, example: 10 })
    @ApiOkResponse({ type: PaginatedOf(FactorDto) })
    findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.service.findAllPaginated(page, perPage);
    }

    @Get('by-categories')
    @ApiOperation({ summary: 'Get factors belonging to given category IDs' })
    @ApiQuery({
        name: 'categoryIds',
        required: true,
        description: 'Comma-separated category IDs',
        example: '1,2',
    })
    @ApiOkResponse({ type: [FactorDto] })
    findByCategories(
        @Query('categoryIds', new ParseIdsPipe({ required: true }))
        ids: number[],
    ) {
        return this.service.findByCategories(ids);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new factor' })
    create(@Body() dto: CreateFactorDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Update a factor' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateFactorDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a factor' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
