import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { CriterionDeletedEvent } from '@common/events/criterion.events';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly repo: CategoriesRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll() {
        return await this.repo.findAll();
    }

    async findOne(id: number) {
        const category = await this.repo.findById(id);
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async create(dto: CreateCategoryDto) {
        const newCategory = await this.repo.create(dto);
        return newCategory;
    }

    async update(id: number, dto: UpdateCategoryDto) {
        const updatedCategory = await this.repo.update(id, dto);
        return updatedCategory;
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
