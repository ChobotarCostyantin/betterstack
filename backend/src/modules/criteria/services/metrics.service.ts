import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MetricsRepository } from '../repositories/metrics.repository';
import { CreateMetricDto } from '../dto/create-metric.dto';
import { UpdateMetricDto } from '../dto/update-metric.dto';
import { MetricDto } from '../dto/metric-response.dto';
import { MetricDeletedEvent } from '@common/events/metric.events';

@Injectable()
export class MetricsService {
    constructor(
        private readonly repo: MetricsRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(categoryIds?: number[]): Promise<MetricDto[]> {
        const metrics =
            categoryIds && categoryIds.length > 0
                ? await this.repo.findByCategories(categoryIds)
                : await this.repo.findAll();
        return metrics.map((m) => ({
            id: m.id,
            name: m.name,
            higherIsBetter: m.higherIsBetter,
        }));
    }

    async create(dto: CreateMetricDto): Promise<MetricDto> {
        const metric = await this.repo.create(dto);
        return {
            id: metric.id,
            name: metric.name,
            higherIsBetter: metric.higherIsBetter,
        };
    }

    async update(id: number, dto: UpdateMetricDto): Promise<MetricDto> {
        const metric = await this.repo.update(id, dto);
        if (!metric)
            throw new NotFoundException(`Metric with ID ${id} not found`);
        return {
            id: metric.id,
            name: metric.name,
            higherIsBetter: metric.higherIsBetter,
        };
    }

    async remove(id: number) {
        const metric = await this.repo.findById(id);
        if (!metric)
            throw new NotFoundException(`Metric with ID ${id} not found`);

        await this.repo.delete(id);

        this.eventEmitter.emit(
            MetricDeletedEvent.eventName,
            new MetricDeletedEvent(id),
        );

        return { success: true };
    }
}
