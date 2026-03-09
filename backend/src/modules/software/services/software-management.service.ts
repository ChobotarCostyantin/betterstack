import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Software } from '../entities/software.entity';
import { SoftwareFactor } from '../entities/software-factor.entity';
import { SoftwareMetric } from '../entities/software-metric.entity';
import { CreateSoftwareDto } from '../dto/create-software.dto';
import {
    UpdateSoftwareDto,
    UpdateSoftwareFactorsDto,
    UpdateSoftwareMetricsDto,
} from '../dto/update-software.dto';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { FactorUpdatedEvent } from '@common/events/factor.events';
import { MetricUpdatedEvent } from '@common/events/metric.events';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { FactorsService } from '@modules/criteria/services/factors.service';
import { MetricsService } from '@modules/criteria/services/metrics.service';

@Injectable()
export class SoftwareManagementService {
    constructor(
        @InjectPinoLogger(SoftwareManagementService.name)
        private readonly logger: PinoLogger,
        @InjectRepository(Software)
        private readonly repo: Repository<Software>,
        @InjectRepository(SoftwareFactor)
        private readonly softwareFactorRepo: Repository<SoftwareFactor>,
        @InjectRepository(SoftwareMetric)
        private readonly softwareMetricRepo: Repository<SoftwareMetric>,
        private readonly factorsService: FactorsService,
        private readonly metricsService: MetricsService,
    ) {}

    async create(dto: CreateSoftwareDto): Promise<Software> {
        return this.repo.save(dto as DeepPartial<Software>);
    }

    async update(id: number, dto: UpdateSoftwareDto) {
        return this.repo.update(id, dto as DeepPartial<Software>);
    }

    async remove(id: number): Promise<{ success: true }> {
        const soft = await this.repo.findOneBy({ id });
        if (!soft)
            throw new NotFoundException(`Software with ID ${id} not found`);

        await this.repo.delete(id);

        return { success: true };
    }

    async updateFactors(
        id: number,
        dto: UpdateSoftwareFactorsDto,
    ): Promise<{ success: true }> {
        const sw = await this.repo.findOne({
            where: { id },
            relations: ['categories', 'categories.factors'],
        });
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);

        const allowedFactorIds = new Set(
            sw.categories.flatMap((c) => (c.factors ?? []).map((f) => f.id)),
        );

        const invalidIds = dto.factors
            .map((f) => f.factorId)
            .filter((fId) => !allowedFactorIds.has(fId));

        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `Factor(s) ${invalidIds.join(', ')} do not belong to any of this software's categories`,
            );
        }

        const factorEntities =
            dto.factors.length > 0
                ? await this.factorsService.findByIds(
                      dto.factors.map((f) => f.factorId),
                  )
                : [];
        const factorMap = new Map(factorEntities.map((f) => [f.id, f]));

        await this.softwareFactorRepo.manager.transaction(async (em) => {
            await em.delete(SoftwareFactor, { softwareId: id });

            if (dto.factors.length > 0) {
                await em
                    .createQueryBuilder()
                    .insert()
                    .into(SoftwareFactor)
                    .values(
                        dto.factors.map((f) => {
                            const factor = factorMap.get(f.factorId);
                            return {
                                softwareId: id,
                                factorId: f.factorId,
                                isPositive: f.isPositive,
                                factorName: factor
                                    ? f.isPositive
                                        ? factor.positiveVariant
                                        : factor.negativeVariant
                                    : '',
                            };
                        }),
                    )
                    .execute();
            }
        });

        return { success: true };
    }

    async updateMetrics(
        id: number,
        dto: UpdateSoftwareMetricsDto,
    ): Promise<{ success: true }> {
        const sw = await this.repo.findOne({
            where: { id },
            relations: ['categories', 'categories.metrics'],
        });
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);

        const allowedMetricIds = new Set(
            sw.categories.flatMap((c) => (c.metrics ?? []).map((m) => m.id)),
        );

        const submittedMetricIds = new Set(dto.metrics.map((m) => m.metricId));

        const invalidIds = [...submittedMetricIds].filter(
            (mId) => !allowedMetricIds.has(mId),
        );
        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `Metric(s) ${invalidIds.join(', ')} do not belong to any of this software's categories`,
            );
        }

        const missingIds = [...allowedMetricIds].filter(
            (mId) => !submittedMetricIds.has(mId),
        );
        if (missingIds.length > 0) {
            throw new BadRequestException(
                `All category metrics must be provided. Missing metric(s): ${missingIds.join(', ')}`,
            );
        }

        await this.softwareMetricRepo.manager.transaction(async (em) => {
            await em.delete(SoftwareMetric, { softwareId: id });

            if (dto.metrics.length > 0) {
                const metrics = await this.metricsService.findByIds(
                    dto.metrics.map((m) => m.metricId),
                );
                const metricMap = new Map(metrics.map((m) => [m.id, m]));

                await em
                    .createQueryBuilder()
                    .insert()
                    .into(SoftwareMetric)
                    .values(
                        dto.metrics.map((m) => ({
                            softwareId: id,
                            metricId: m.metricId,
                            value: m.value,
                            metricName: metricMap.get(m.metricId)?.name ?? '',
                        })),
                    )
                    .execute();
            }
        });

        return { success: true };
    }

    @OnEvent(CategoryDeletedEvent.eventName)
    async handleCategoryDeleted(payload: CategoryDeletedEvent) {
        this.logger.info(
            { categoryId: payload.categoryId },
            'Category deleted. Removing it from all software...',
        );

        const softwareList = await this.repo
            .createQueryBuilder('software')
            .innerJoin('software.categories', 'category')
            .where('category.id = :categoryId', {
                categoryId: payload.categoryId,
            })
            .getMany();

        await this.repo.manager.transaction(async (em) => {
            for (const sw of softwareList) {
                const full = await em.findOne(Software, {
                    where: { id: sw.id },
                    relations: ['categories'],
                });
                if (!full) continue;

                full.categories = full.categories.filter(
                    (c) => c.id !== payload.categoryId,
                );
                await em.save(full);
            }
        });
    }

    @OnEvent(SoftwareMarkedUsedEvent.eventName)
    async handleSoftwareMarkedUsed(payload: SoftwareMarkedUsedEvent) {
        this.logger.info(
            { userId: payload.userId, softwareId: payload.softwareId },
            'Software marked as used. Incrementing usageCount...',
        );
        await this.repo.increment({ id: payload.softwareId }, 'usageCount', 1);
    }

    @OnEvent(SoftwareMarkedUnusedEvent.eventName)
    async handleSoftwareMarkedUnused(payload: SoftwareMarkedUnusedEvent) {
        this.logger.info(
            { userId: payload.userId, softwareId: payload.softwareId },
            'Software unmarked as used. Decrementing usageCount...',
        );
        await this.repo
            .createQueryBuilder()
            .update(Software)
            .set({ usageCount: () => 'GREATEST("usageCount" - 1, 0)' })
            .where('id = :id', { id: payload.softwareId })
            .execute();
    }

    @OnEvent(FactorUpdatedEvent.eventName)
    async handleFactorUpdated(payload: FactorUpdatedEvent) {
        this.logger.info(
            { factorId: payload.factorId },
            'Factor renamed. Syncing cached names in software_factors...',
        );
        await this.softwareFactorRepo
            .createQueryBuilder()
            .update(SoftwareFactor)
            .set({ factorName: payload.positiveVariant })
            .where('factor_id = :factorId AND is_positive = true', {
                factorId: payload.factorId,
            })
            .execute();

        await this.softwareFactorRepo
            .createQueryBuilder()
            .update(SoftwareFactor)
            .set({ factorName: payload.negativeVariant })
            .where('factor_id = :factorId AND is_positive = false', {
                factorId: payload.factorId,
            })
            .execute();
    }

    @OnEvent(MetricUpdatedEvent.eventName)
    async handleMetricUpdated(payload: MetricUpdatedEvent) {
        this.logger.info(
            { metricId: payload.metricId },
            'Metric renamed. Syncing cached name in software_metrics...',
        );
        await this.softwareMetricRepo.update(
            { metricId: payload.metricId },
            { metricName: payload.name },
        );
    }
}
