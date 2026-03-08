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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { WithRole } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
    RenameCategoryDto,
    UpdateCategoryCriteriaDto,
} from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth()
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all categories (paginated)' })
    findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('perPage', new ParseIntPipe({ optional: true })) perPage = 10,
    ) {
        return this.service.findAll(page, perPage);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get category by ID with its factors and metrics',
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOneWithCriteria(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Create new category' })
    create(@Body() dto: CreateCategoryDto) {
        return this.service.create(dto);
    }

    @Put(':id/rename')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Rename category (slug and/or name)' })
    rename(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RenameCategoryDto,
    ) {
        return this.service.rename(id, dto);
    }

    @Put(':id/criteria')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({
        summary: 'Replace the full factors and metrics list for a category',
    })
    updateCriteria(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryCriteriaDto,
    ) {
        return this.service.updateCriteria(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    @ApiOperation({ summary: 'Delete category' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
