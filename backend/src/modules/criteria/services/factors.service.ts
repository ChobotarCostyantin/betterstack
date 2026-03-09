import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Factor } from '../entities/factor.entity';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';
import { FactorDto } from '../dto/factor-response.dto';
import {
    FactorDeletedEvent,
    FactorUpdatedEvent,
} from '@common/events/factor.events';

@Injectable()
export class FactorsService {
    constructor(
        @InjectRepository(Factor)
        private readonly repo: Repository<Factor>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(categoryIds?: number[]): Promise<FactorDto[]> {
        const factors =
            categoryIds && categoryIds.length > 0
                ? await this.repo
                      .createQueryBuilder('factor')
                      .innerJoin('factor.categories', 'category')
                      .where('category.id IN (:...categoryIds)', {
                          categoryIds,
                      })
                      .getMany()
                : await this.repo.find();
        return factors.map((f) => ({
            id: f.id,
            positiveVariant: f.positiveVariant,
            negativeVariant: f.negativeVariant,
        }));
    }

    async create(dto: CreateFactorDto): Promise<FactorDto> {
        const factor = await this.repo.save(this.repo.create(dto));
        return {
            id: factor.id,
            positiveVariant: factor.positiveVariant,
            negativeVariant: factor.negativeVariant,
        };
    }

    async update(id: number, dto: UpdateFactorDto): Promise<FactorDto> {
        await this.repo.update(id, dto as DeepPartial<Factor>);
        const factor = await this.repo.findOneBy({ id });
        if (!factor)
            throw new NotFoundException(`Factor with ID ${id} not found`);

        this.eventEmitter.emit(
            FactorUpdatedEvent.eventName,
            new FactorUpdatedEvent(
                id,
                factor.positiveVariant,
                factor.negativeVariant,
            ),
        );

        return {
            id: factor.id,
            positiveVariant: factor.positiveVariant,
            negativeVariant: factor.negativeVariant,
        };
    }

    async remove(id: number) {
        const factor = await this.repo.findOneBy({ id });
        if (!factor)
            throw new NotFoundException(`Factor with ID ${id} not found`);

        await this.repo.delete(id);

        this.eventEmitter.emit(
            FactorDeletedEvent.eventName,
            new FactorDeletedEvent(id),
        );

        return { success: true };
    }

    findByIds(ids: number[]): Promise<Factor[]> {
        return this.repo.findBy({ id: In(ids) });
    }
}
