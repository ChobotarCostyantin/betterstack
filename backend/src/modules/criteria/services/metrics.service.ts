import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Metric } from '../entities/metric.entity';
import { CreateMetricDto } from '../dto/create-metric.dto';
import { UpdateMetricDto } from '../dto/update-metric.dto';
import { MetricDto } from '../dto/metric-response.dto';
import {
    MetricDeletedEvent,
    MetricUpdatedEvent,
} from '@common/events/metric.events';

@Injectable()
export class MetricsService {
    constructor(
        @InjectRepository(Metric)
        private readonly repo: Repository<Metric>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(categoryIds?: number[]): Promise<MetricDto[]> {
        const metrics =
            categoryIds && categoryIds.length > 0
                ? await this.repo
                      .createQueryBuilder('metric')
                      .innerJoin('metric.categories', 'category')
                      .where('category.id IN (:...categoryIds)', {
                          categoryIds,
                      })
                      .getMany()
                : await this.repo.find();
        return metrics.map((m) => ({
            id: m.id,
            name: m.name,
            higherIsBetter: m.higherIsBetter,
        }));
    }

    async create(dto: CreateMetricDto): Promise<MetricDto> {
        const metric = await this.repo.save(this.repo.create(dto));
        return {
            id: metric.id,
            name: metric.name,
            higherIsBetter: metric.higherIsBetter,
        };
    }

    async update(id: number, dto: UpdateMetricDto): Promise<MetricDto> {
        await this.repo.update(id, dto as DeepPartial<Metric>);
        const metric = await this.repo.findOneBy({ id });
        if (!metric)
            throw new NotFoundException(`Metric with ID ${id} not found`);

        this.eventEmitter.emit(
            MetricUpdatedEvent.eventName,
            new MetricUpdatedEvent(id, metric.name),
        );

        return {
            id: metric.id,
            name: metric.name,
            higherIsBetter: metric.higherIsBetter,
        };
    }

    async remove(id: number) {
        const metric = await this.repo.findOneBy({ id });
        if (!metric)
            throw new NotFoundException(`Metric with ID ${id} not found`);

        await this.repo.delete(id);

        this.eventEmitter.emit(
            MetricDeletedEvent.eventName,
            new MetricDeletedEvent(id),
        );

        return { success: true };
    }

    findByIds(ids: number[]): Promise<Metric[]> {
        return this.repo.findBy({ id: In(ids) });
    }
}
