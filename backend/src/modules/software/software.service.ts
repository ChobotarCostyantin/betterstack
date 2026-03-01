import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { SoftwareRepository } from './repositories/software.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { CategoryDeletedEvent } from 'src/common/events/category.events';

@Injectable()
export class SoftwareService {
    constructor(private readonly repo: SoftwareRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    findOne(id: number) {
        const sw = this.repo.findById(id);
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);
        return sw;
    }

    create(dto: CreateSoftwareDto) {
        const newSoftware = this.repo.create(dto);
        return newSoftware;
    }

    update(id: number, dto: UpdateSoftwareDto) {
        const updatedSoftware = this.repo.update(id, dto);
        return updatedSoftware;
    }
    async remove(id: number) {
        const category = await this.repo.findById(id);
        if (!category)
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
