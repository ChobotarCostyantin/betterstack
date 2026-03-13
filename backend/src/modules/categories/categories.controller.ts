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
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { SuccessResponseDto } from '@common/dto/success-response.dto';
import {
    CategoryListItemDto,
    CategoryDetailDto,
} from './dto/category-response.dto';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
    RenameCategoryDto,
    UpdateCategoryCriteriaDto,
} from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all categories (paginated)' })
    @ApiOkResponse({ type: PaginatedOf(CategoryListItemDto) })
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
    @ApiOkResponse({ type: CategoryDetailDto })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOneWithCriteria(id);
    }

    @Get('/slug/:slug')
    @ApiOperation({
        summary: 'Get category by Slug with its factors and metrics',
    })
    @ApiOkResponse({ type: CategoryDetailDto })
    findOneBySlug(@Param('slug') slug: string) {
        return this.service.findOneWithSlug(slug);
    }

    @Post()
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Create new category' })
    @ApiCreatedResponse({ type: CategoryListItemDto })
    create(@Body() dto: CreateCategoryDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Update category (slug and/or name)' })
    @ApiOkResponse({ type: SuccessResponseDto })
    rename(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RenameCategoryDto,
    ) {
        return this.service.rename(id, dto);
    }

    @Put(':id/criteria')
    @Authenticated(Role.ADMIN)
    @ApiOperation({
        summary: 'Replace the full factors and metrics list for a category',
    })
    @ApiOkResponse({ type: SuccessResponseDto })
    updateCriteria(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryCriteriaDto,
    ) {
        return this.service.updateCriteria(id, dto);
    }

    @Delete(':id')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Delete category' })
    @ApiOkResponse({ type: SuccessResponseDto })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
