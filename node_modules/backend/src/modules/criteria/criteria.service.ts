import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { CriteriaRepository } from './repositories/criteria.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CriterionDeletedEvent } from 'src/common/events/criterion.events';

@Injectable()
export class CriteriaService {
    constructor(
        private readonly repo: CriteriaRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll() {
        return await this.repo.findAll();
    }

    async findOne(id: number) {
        const criterion = await this.repo.findById(id);
        if (!criterion)
            throw new NotFoundException(`Criterion with ID ${id} not found`);
        return criterion;
    }

    async create(dto: CreateCriterionDto) {
        const newCriterion = await this.repo.create(dto);
        return newCriterion;
    }

    async update(id: number, dto: UpdateCriterionDto) {
        const newCriterion = await this.repo.update(id, dto);
        return newCriterion;
    }

    async remove(id: number) {
        const criterion = await this.repo.findById(id);
        if (!criterion)
            throw new NotFoundException(`Criterion with ID ${id} not found`);

        await this.repo.delete(id);

        this.eventEmitter.emit(
            CriterionDeletedEvent.eventName,
            new CriterionDeletedEvent(id),
        );

        return { success: true };
    }
}
