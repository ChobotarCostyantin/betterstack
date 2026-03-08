import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { CreateCategoryDto } from './dto/create-category.dto';
import {
    RenameCategoryDto,
    UpdateCategoryCriteriaDto,
} from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { FactorDeletedEvent } from '@common/events/factor.events';
import { MetricDeletedEvent } from '@common/events/metric.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    CategoryListItemDto,
    CategoryDetailDto,
} from './dto/category-response.dto';

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
        const category = await this.repo.findByIdWithFactorsAndMetrics(id);
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);

        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            factors: (category.factors ?? []).map((f) => ({
                id: f.id,
                positiveVariant: f.positiveVariant,
                negativeVariant: f.negativeVariant,
            })),
            metrics: (category.metrics ?? []).map((m) => ({
                id: m.id,
                name: m.name,
                higherIsBetter: m.higherIsBetter,
            })),
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
        const updated = await this.repo.setFactorsAndMetrics(
            id,
            dto.factorIds,
            dto.metricIds,
        );
        if (!updated)
            throw new NotFoundException(`Category with ID ${id} not found`);

        return {
            id: updated.id,
            slug: updated.slug,
            name: updated.name,
            factors: (updated.factors ?? []).map((f) => ({
                id: f.id,
                positiveVariant: f.positiveVariant,
                negativeVariant: f.negativeVariant,
            })),
            metrics: (updated.metrics ?? []).map((m) => ({
                id: m.id,
                name: m.name,
                higherIsBetter: m.higherIsBetter,
            })),
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

    @OnEvent(FactorDeletedEvent.eventName)
    async handleFactorDeletedEvent(payload: FactorDeletedEvent) {
        console.log(
            `[Event] Factor ${payload.factorId} deleted. Removing it from all categories...`,
        );
        const categoriesWithFactor = await this.repo.findWithFactorIds([
            payload.factorId,
        ]);

        const updatePromises = categoriesWithFactor.map(async (category) => {
            const cat = await this.repo.findByIdWithFactorsAndMetrics(
                category.id,
            );
            if (!cat) return;
            cat.factors = cat.factors.filter((f) => f.id !== payload.factorId);
            return this.repo.save(cat);
        });

        await Promise.all(updatePromises);
    }

    @OnEvent(MetricDeletedEvent.eventName)
    async handleMetricDeletedEvent(payload: MetricDeletedEvent) {
        console.log(
            `[Event] Metric ${payload.metricId} deleted. Removing it from all categories...`,
        );
        const categoriesWithMetric = await this.repo.findWithMetricIds([
            payload.metricId,
        ]);

        const updatePromises = categoriesWithMetric.map(async (category) => {
            const cat = await this.repo.findByIdWithFactorsAndMetrics(
                category.id,
            );
            if (!cat) return;
            cat.metrics = cat.metrics.filter((m) => m.id !== payload.metricId);
            return this.repo.save(cat);
        });

        await Promise.all(updatePromises);
    }
}
