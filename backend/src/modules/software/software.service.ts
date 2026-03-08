import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeepPartial } from 'typeorm';

import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { Software } from './entities/software.entity';
import { SoftwareRepository } from './software.repository';
import { CategoryDeletedEvent } from '@common/events/category.events';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';

@Injectable()
export class SoftwareService {
    constructor(private readonly repo: SoftwareRepository) {}

    async findAll() {
        return await this.repo.findAll();
    }

    async findOne(id: number) {
        const sw = await this.repo.findById(id);
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);
        return sw;
    }

    async findOneBySlug(slug: string) {
        const sw = await this.repo.findBySlug(slug);
        if (!sw)
            throw new NotFoundException(`Software with slug ${slug} not found`);
        return sw;
    }

    async create(dto: CreateSoftwareDto): Promise<Software> {
        return this.repo.create(dto as DeepPartial<Software>);
    }

    async update(id: number, dto: UpdateSoftwareDto) {
        return this.repo.update(id, dto as DeepPartial<Software>);
    }

    async remove(id: number) {
        const soft = await this.repo.findById(id);
        if (!soft)
            throw new NotFoundException(`Software with ID ${id} not found`);

        await this.repo.delete(id);

        return { success: true };
    }

    @OnEvent(CategoryDeletedEvent.eventName)
    async handleCategoryDeleted(payload: CategoryDeletedEvent) {
        console.log(
            `[Event] Category ${payload.categoryId} deleted. Removing it from all software...`,
        );

        const softwareList = await this.repo.findWithCategoryId(
            payload.categoryId,
        );

        const updatePromises = softwareList.map(async (sw) => {
            const swWithCategories = await this.repo.findByIdWithCategories(
                sw.id,
            );
            if (!swWithCategories) return;
            swWithCategories.categories = swWithCategories.categories.filter(
                (c) => c.id !== payload.categoryId,
            );
            return this.repo.save(swWithCategories);
        });

        await Promise.all(updatePromises);
    }

    @OnEvent(SoftwareMarkedUsedEvent.eventName)
    async handleSoftwareMarkedUsed(payload: SoftwareMarkedUsedEvent) {
        console.log(
            `[Event] User ${payload.userId} marked software ${payload.softwareId} as used. Incrementing usageCount...`,
        );
        await this.repo.incrementUsageCount(payload.softwareId);
    }

    @OnEvent(SoftwareMarkedUnusedEvent.eventName)
    async handleSoftwareMarkedUnused(payload: SoftwareMarkedUnusedEvent) {
        console.log(
            `[Event] User ${payload.userId} unmarked software ${payload.softwareId}. Decrementing usageCount...`,
        );
        await this.repo.decrementUsageCount(payload.softwareId);
    }
}
