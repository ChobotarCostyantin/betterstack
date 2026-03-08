import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FactorsRepository } from '../repositories/factors.repository';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';
import { FactorDto } from '../dto/factor-response.dto';
import { FactorDeletedEvent } from '@common/events/factor.events';

@Injectable()
export class FactorsService {
    constructor(
        private readonly repo: FactorsRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(categoryIds?: number[]): Promise<FactorDto[]> {
        const factors =
            categoryIds && categoryIds.length > 0
                ? await this.repo.findByCategories(categoryIds)
                : await this.repo.findAll();
        return factors.map((f) => ({
            id: f.id,
            positiveVariant: f.positiveVariant,
            negativeVariant: f.negativeVariant,
        }));
    }

    async create(dto: CreateFactorDto): Promise<FactorDto> {
        const factor = await this.repo.create(dto);
        return {
            id: factor.id,
            positiveVariant: factor.positiveVariant,
            negativeVariant: factor.negativeVariant,
        };
    }

    async update(id: number, dto: UpdateFactorDto): Promise<FactorDto> {
        const factor = await this.repo.update(id, dto);
        if (!factor)
            throw new NotFoundException(`Factor with ID ${id} not found`);
        return {
            id: factor.id,
            positiveVariant: factor.positiveVariant,
            negativeVariant: factor.negativeVariant,
        };
    }

    async remove(id: number) {
        const factor = await this.repo.findById(id);
        if (!factor)
            throw new NotFoundException(`Factor with ID ${id} not found`);

        await this.repo.delete(id);

        this.eventEmitter.emit(
            FactorDeletedEvent.eventName,
            new FactorDeletedEvent(id),
        );

        return { success: true };
    }
}
