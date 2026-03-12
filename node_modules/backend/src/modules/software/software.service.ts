import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { SoftwareRepository } from './repositories/software.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { CategoryDeletedEvent } from 'src/common/events/category.events';

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

    async create(dto: CreateSoftwareDto) {
        const newSoftware = await this.repo.create(dto);
        return newSoftware;
    }

    async update(id: number, dto: UpdateSoftwareDto) {
        const updatedSoftware = await this.repo.update(id, dto);
        return updatedSoftware;
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
            `[Event] Category ${payload.categoryId} deleted. Updating software...`,
        );

        const softwareList = await this.repo.findWithCategoryId(
            payload.categoryId,
        );

        const updatePromises = softwareList.map((sw) => {
            sw.categoryIds = sw.categoryIds.filter(
                (id) => id !== payload.categoryId,
            );
            return this.repo.update(sw.id, sw);
        });

        await Promise.all(updatePromises);
    }
}
