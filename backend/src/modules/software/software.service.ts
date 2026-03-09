import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Software } from './entities/software.entity';
import { SoftwareFactor } from './entities/software-factor.entity';
import { SoftwareMetric } from './entities/software-metric.entity';
import { SoftwareComparisonNote } from './entities/software-comparison-note.entity';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { FactorUpdatedEvent } from '@common/events/factor.events';
import { MetricUpdatedEvent } from '@common/events/metric.events';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    SoftwareListItemDto,
    SoftwareDetailDto,
    SoftwareFactorDto,
    SoftwareFactorsDto,
    SoftwareMetricDto,
} from './dto/software-response.dto';
import {
    SoftwareComparisonDto,
    SoftwareComparisonSideDto,
    MetricComparisonItemDto,
} from './dto/software-comparison.dto';

@Injectable()
export class SoftwareService {
    constructor(
        @InjectPinoLogger(SoftwareService.name)
        private readonly logger: PinoLogger,
        @InjectRepository(Software)
        private readonly repo: Repository<Software>,
        @InjectRepository(SoftwareFactor)
        private readonly softwareFactorRepo: Repository<SoftwareFactor>,
        @InjectRepository(SoftwareMetric)
        private readonly softwareMetricRepo: Repository<SoftwareMetric>,
        @InjectRepository(SoftwareComparisonNote)
        private readonly comparisonNoteRepo: Repository<SoftwareComparisonNote>,
    ) {}

    private toListItem(sw: Software): SoftwareListItemDto {
        return {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            logoUrl: sw.logoUrl,
            shortDescription: sw.shortDescription,
            usageCount: sw.usageCount,
            categories: (sw.categories ?? []).map((c) => c.name),
        };
    }

    async findAll(
        q: string | undefined,
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<SoftwareListItemDto>> {
        const qb = this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .orderBy('software.usageCount', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage);

        if (q) {
            qb.where(
                'software.name ILIKE :q OR software.shortDescription ILIKE :q',
                { q: `%${q}%` },
            );
        }

        const [items, total] = await qb.getManyAndCount();
        return new PaginatedResponseDto(
            items.map((sw) => this.toListItem(sw)),
            total,
            page,
            perPage,
        );
    }

    async findMostUsed(limit: number): Promise<SoftwareListItemDto[]> {
        const items = await this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .orderBy('software.usageCount', 'DESC')
            .take(limit)
            .getMany();
        return items.map((sw) => this.toListItem(sw));
    }

    async findOneBySlug(slug: string): Promise<SoftwareDetailDto> {
        const sw = await this.repo.findOne({
            where: { slug },
            relations: [
                'categories',
                'softwareFactors',
                'softwareMetrics',
                'softwareMetrics.metric',
            ],
        });
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const toFactorDto = (sf: SoftwareFactor): SoftwareFactorDto => ({
            factorId: sf.factorId,
            factorName: sf.factorName,
        });

        const factors: SoftwareFactorsDto = (
            sw.softwareFactors ?? []
        ).reduce<SoftwareFactorsDto>(
            (acc, sf) => {
                if (sf.isPositive) {
                    acc.positive.push(toFactorDto(sf));
                } else {
                    acc.negative.push(toFactorDto(sf));
                }
                return acc;
            },
            { positive: [], negative: [] },
        );

        const metrics: SoftwareMetricDto[] = (sw.softwareMetrics ?? []).map(
            (sm) => ({
                metricId: sm.metricId,
                metricName: sm.metricName,
                higherIsBetter: sm.metric?.higherIsBetter ?? false,
                value: sm.value,
            }),
        );

        return {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            developer: sw.developer,
            shortDescription: sw.shortDescription,
            fullDescription: sw.fullDescription,
            websiteUrl: sw.websiteUrl,
            gitRepoUrl: sw.gitRepoUrl,
            logoUrl: sw.logoUrl,
            screenshotUrls: sw.screenshotUrls,
            usageCount: sw.usageCount,
            createdAt: sw.createdAt,
            updatedAt: sw.updatedAt,
            categories: (sw.categories ?? []).map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
            })),
            factors,
            metrics,
        };
    }

    private toComparisonSide(sw: Software): SoftwareComparisonSideDto {
        const toFactorDto = (sf: SoftwareFactor): SoftwareFactorDto => ({
            factorId: sf.factorId,
            factorName: sf.factorName,
        });

        const factors: SoftwareFactorsDto = (
            sw.softwareFactors ?? []
        ).reduce<SoftwareFactorsDto>(
            (acc, sf) => {
                if (sf.isPositive) {
                    acc.positive.push(toFactorDto(sf));
                } else {
                    acc.negative.push(toFactorDto(sf));
                }
                return acc;
            },
            { positive: [], negative: [] },
        );

        return {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            developer: sw.developer,
            shortDescription: sw.shortDescription,
            websiteUrl: sw.websiteUrl,
            gitRepoUrl: sw.gitRepoUrl,
            logoUrl: sw.logoUrl,
            screenshotUrls: sw.screenshotUrls,
            usageCount: sw.usageCount,
            createdAt: sw.createdAt,
            updatedAt: sw.updatedAt,
            categories: (sw.categories ?? []).map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
            })),
            factors,
        };
    }

    async compareBySlug(
        slugA: string,
        slugB: string,
    ): Promise<SoftwareComparisonDto> {
        if (slugA === slugB) {
            throw new BadRequestException(
                'The two software slugs must be different',
            );
        }

        const relations = [
            'categories',
            'softwareFactors',
            'softwareMetrics',
            'softwareMetrics.metric',
        ];

        const [swA, swB] = await Promise.all([
            this.repo.findOne({ where: { slug: slugA }, relations }),
            this.repo.findOne({ where: { slug: slugB }, relations }),
        ]);

        if (!swA)
            throw new NotFoundException(
                `Software with slug '${slugA}' not found`,
            );
        if (!swB)
            throw new NotFoundException(
                `Software with slug '${slugB}' not found`,
            );

        if (swA.id === swB.id) {
            throw new BadRequestException(
                'The two software slugs must be different',
            );
        }

        // Lookup comparison note in both orderings (A,B) and (B,A)
        const note = await this.comparisonNoteRepo.findOne({
            where: [
                { softwareAId: swA.id, softwareBId: swB.id },
                { softwareAId: swB.id, softwareBId: swA.id },
            ],
        });

        // Build metric maps keyed by metricId
        const aMetrics = new Map(
            (swA.softwareMetrics ?? []).map((sm) => [sm.metricId, sm]),
        );
        const bMetrics = new Map(
            (swB.softwareMetrics ?? []).map((sm) => [sm.metricId, sm]),
        );

        const allMetricIds = new Set([...aMetrics.keys(), ...bMetrics.keys()]);

        const metricsComparison: MetricComparisonItemDto[] = [];

        for (const metricId of allMetricIds) {
            const aSm = aMetrics.get(metricId);
            const bSm = bMetrics.get(metricId);

            // Prefer the side that has the metric for higherIsBetter
            const higherIsBetter =
                (aSm?.metric ?? bSm?.metric)?.higherIsBetter ?? false;

            const aValue = aSm ? Number(aSm.value) : null;
            const bValue = bSm ? Number(bSm.value) : null;
            const metricName = (aSm ?? bSm)!.metricName;

            let winner: 'a' | 'b' | null = null;
            if (aValue !== null && bValue !== null && aValue !== bValue) {
                winner = (higherIsBetter ? aValue > bValue : aValue < bValue)
                    ? 'a'
                    : 'b';
            }

            metricsComparison.push({
                metricId,
                metricName,
                higherIsBetter,
                aValue,
                bValue,
                winner,
            });
        }

        return {
            softwareA: this.toComparisonSide(swA),
            softwareB: this.toComparisonSide(swB),
            metricsComparison,
            comparisonNote: note?.note ?? null,
        };
    }

    async findAlternatives(
        slug: string,
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<SoftwareListItemDto>> {
        const sw = await this.repo.findOneBy({ slug });
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const target = await this.repo.findOne({
            where: { id: sw.id },
            relations: ['categories'],
        });

        if (!target || !target.categories.length) {
            return new PaginatedResponseDto([], 0, page, perPage);
        }

        const categoryIds = target.categories.map((c) => c.id);
        const qb = this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .innerJoin(
                'software.categories',
                'sharedCat',
                'sharedCat.id IN (:...categoryIds)',
                { categoryIds },
            )
            .where('software.id != :softwareId', { softwareId: sw.id })
            .orderBy('software.usageCount', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage);

        const [items, total] = await qb.getManyAndCount();
        return new PaginatedResponseDto(
            items.map((s) => this.toListItem(s)),
            total,
            page,
            perPage,
        );
    }

    /** @deprecated use findOneBySlug */
    async findOne(id: number) {
        const sw = await this.repo.findOneBy({ id });
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);
        return sw;
    }

    async create(dto: CreateSoftwareDto): Promise<Software> {
        return this.repo.save(dto as DeepPartial<Software>);
    }

    async update(id: number, dto: UpdateSoftwareDto) {
        return this.repo.update(id, dto as DeepPartial<Software>);
    }

    async remove(id: number) {
        const soft = await this.repo.findOneBy({ id });
        if (!soft)
            throw new NotFoundException(`Software with ID ${id} not found`);

        await this.repo.delete(id);

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

        const updatePromises = softwareList.map(async (sw) => {
            const full = await this.repo.findOne({
                where: { id: sw.id },
                relations: ['categories'],
            });
            if (!full) return;
            full.categories = full.categories.filter(
                (c) => c.id !== payload.categoryId,
            );
            return this.repo.save(full);
        });

        await Promise.all(updatePromises);
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
            .set({ usageCount: () => 'GREATEST("usage_count" - 1, 0)' })
            .where('id = :id', { id: payload.softwareId })
            .execute();
    }

    @OnEvent(FactorUpdatedEvent.eventName)
    async handleFactorUpdated(payload: FactorUpdatedEvent) {
        this.logger.info(
            { factorId: payload.factorId },
            'Factor renamed. Syncing cached names in software_factors...',
        );
        // SoftwareFactor.factorName caches the human-readable variant label.
        // Positive rows get positiveVariant; negative rows get negativeVariant.
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
