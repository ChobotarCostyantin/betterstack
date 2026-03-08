import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { CreateCategoryDto } from './dto/create-category.dto';
import {
    RenameCategoryDto,
    UpdateCategoryCriteriaDto,
} from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { CriterionDeletedEvent } from '@common/events/criterion.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    CategoryListItemDto,
    CategoryDetailDto,
    UniqueCriteriaDto,
} from './dto/category-response.dto';
import {
    BooleanCriterionDto,
    NumericCriterionDto,
} from '../criteria/dto/criterion-response.dto';
import { CriterionType } from '../criteria/entities/criterion.entity';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly repo: CategoriesRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<CategoryListItemDto>> {
        const [categories, total] = await this.repo.findAllPaginated(
            page,
            perPage,
        );
        const items: CategoryListItemDto[] = categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
        }));
        return new PaginatedResponseDto(items, total, page, perPage);
    }

    async findOneWithCriteria(id: number): Promise<CategoryDetailDto> {
        const category = await this.repo.findByIdWithCriteria(id);
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);

        const booleanCriteria: BooleanCriterionDto[] = (category.criteria ?? [])
            .filter((c) => c.type === CriterionType.BOOLEAN)
            .map((c) => ({
                id: c.id,
                name: c.name,
                isPositive: c.value !== 0,
            }));

        const numericCriteria: NumericCriterionDto[] = (category.criteria ?? [])
            .filter((c) => c.type === CriterionType.NUMERIC)
            .map((c) => ({
                id: c.id,
                name: c.name,
                higherIsBetter: c.higherIsBetter,
            }));

        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            booleanCriteria,
            numericCriteria,
        };
    }

    async getUniqueCriteriaByCategoryIds(
        categoryIds: number[],
    ): Promise<UniqueCriteriaDto> {
        const categories = await this.repo.findByIdsWithCriteria(categoryIds);

        const booleanMap = new Map<number, BooleanCriterionDto>();
        const numericMap = new Map<number, NumericCriterionDto>();

        for (const cat of categories) {
            for (const c of cat.criteria ?? []) {
                if (c.type === CriterionType.BOOLEAN && !booleanMap.has(c.id)) {
                    booleanMap.set(c.id, {
                        id: c.id,
                        name: c.name,
                        isPositive: c.value !== 0,
                    });
                } else if (
                    c.type === CriterionType.NUMERIC &&
                    !numericMap.has(c.id)
                ) {
                    numericMap.set(c.id, {
                        id: c.id,
                        name: c.name,
                        higherIsBetter: c.higherIsBetter,
                    });
                }
            }
        }

        return {
            booleanCriteria: Array.from(booleanMap.values()),
            numericCriteria: Array.from(numericMap.values()),
        };
    }

    /** @deprecated use findOneWithCriteria */
    async findOne(id: number) {
        const category = await this.repo.findById(id);
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async create(dto: CreateCategoryDto) {
        return await this.repo.create(dto);
    }

    async rename(id: number, dto: RenameCategoryDto) {
        const category = await this.repo.findById(id);
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        await this.repo.update(id, dto);
        return { ...category, ...dto };
    }

    async updateCriteria(id: number, dto: UpdateCategoryCriteriaDto) {
        const updated = await this.repo.setCriteria(
            id,
            dto.booleanCriteriaIds,
            dto.numericCriteriaIds,
        );
        if (!updated)
            throw new NotFoundException(`Category with ID ${id} not found`);

        const booleanCriteria: BooleanCriterionDto[] = (updated.criteria ?? [])
            .filter((c) => c.type === CriterionType.BOOLEAN)
            .map((c) => ({
                id: c.id,
                name: c.name,
                isPositive: c.value !== 0,
            }));

        const numericCriteria: NumericCriterionDto[] = (updated.criteria ?? [])
            .filter((c) => c.type === CriterionType.NUMERIC)
            .map((c) => ({
                id: c.id,
                name: c.name,
                higherIsBetter: c.higherIsBetter,
            }));

        return {
            id: updated.id,
            slug: updated.slug,
            name: updated.name,
            booleanCriteria,
            numericCriteria,
        };
    }

    async remove(id: number) {
        const category = await this.repo.findById(id);
        if (!category) throw new NotFoundException('Category not found');

        await this.repo.delete(id);

        this.eventEmitter.emit(
            CategoryDeletedEvent.eventName,
            new CategoryDeletedEvent(id),
        );

        return { success: true };
    }

    @OnEvent(CriterionDeletedEvent.eventName)
    async handleCriterionDeletedEvent(payload: CriterionDeletedEvent) {
        console.log(
            `[Event] Criterion ${payload.criterionId} deleted. Removing it from all categories...`,
        );
        const categoriesWithCriterion = await this.repo.findWithCriteriaIds([
            payload.criterionId,
        ]);

        const updatePromises = categoriesWithCriterion.map(async (category) => {
            const categoryWithCriteria = await this.repo.findByIdWithCriteria(
                category.id,
            );
            if (!categoryWithCriteria) return;
            categoryWithCriteria.criteria =
                categoryWithCriteria.criteria.filter(
                    (c) => c.id !== payload.criterionId,
                );
            return this.repo.save(categoryWithCriteria);
        });

        await Promise.all(updatePromises);
    }
}
