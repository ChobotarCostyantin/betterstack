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
import { FactorsService } from '../services/factors.service';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';

@ApiTags('Criteria')
@Controller('criteria/factors')
@ApiBearerAuth()
export class FactorsController {
    constructor(private readonly service: FactorsService) {}

    @Get()
    @ApiOperation({
        summary: 'Get all factors, optionally filtered by category IDs',
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new factor' })
    create(@Body() dto: CreateFactorDto) {
        return this.service.create(dto);
    }

    @Put(':id')
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a factor' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
