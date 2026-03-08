import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import {
    BooleanCriterionDto,
    NumericCriterionDto,
} from './dto/criterion-response.dto';
import { CriteriaRepository } from './criteria.repository';
import { CriterionType } from './entities/criterion.entity';
import { CriterionDeletedEvent } from '@common/events/criterion.events';

@Injectable()
export class CriteriaService {
    constructor(
        private readonly repo: CriteriaRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findBoolean(): Promise<BooleanCriterionDto[]> {
        const criteria = await this.repo.findByType(CriterionType.BOOLEAN);
        return criteria.map((c) => ({
            id: c.id,
            name: c.name,
            isPositive: c.value !== 0,
        }));
    }

    async findNumeric(): Promise<NumericCriterionDto[]> {
        const criteria = await this.repo.findByType(CriterionType.NUMERIC);
        return criteria.map((c) => ({
            id: c.id,
            name: c.name,
            higherIsBetter: c.higherIsBetter,
        }));
    }

    async findOne(id: number) {
        const criterion = await this.repo.findById(id);
        if (!criterion)
            throw new NotFoundException(`Criterion with ID ${id} not found`);
        return criterion;
    }

    async create(dto: CreateCriterionDto) {
        return this.repo.create(dto);
    }

    async update(id: number, dto: UpdateCriterionDto) {
        return this.repo.update(id, dto);
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
