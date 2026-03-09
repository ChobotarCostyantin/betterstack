import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Category } from './entities/category.entity';
import { Factor } from '@modules/criteria/entities/factor.entity';
import { Metric } from '@modules/criteria/entities/metric.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
    RenameCategoryDto,
    UpdateCategoryCriteriaDto,
} from './dto/update-category.dto';
import { CategoryDeletedEvent } from '@common/events/category.events';
import { FactorDeletedEvent } from '@common/events/factor.events';
import { MetricDeletedEvent } from '@common/events/metric.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    CategoryListItemDto,
    CategoryDetailDto,
} from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectPinoLogger(CategoriesService.name)
        private readonly logger: PinoLogger,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Factor)
        private readonly factorRepo: Repository<Factor>,
        @InjectRepository(Metric)
        private readonly metricRepo: Repository<Metric>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async findAll(
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<CategoryListItemDto>> {
        const [categories, total] = await this.categoryRepo.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            order: { id: 'ASC' },
        });
        const items: CategoryListItemDto[] = categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
        }));
        return new PaginatedResponseDto(items, total, page, perPage);
    }

    async findOneWithCriteria(id: number): Promise<CategoryDetailDto> {
        const category = await this.categoryRepo.findOne({
            where: { id },
            relations: ['factors', 'metrics'],
        });
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);

        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            factors: (category.factors ?? []).map((f) => ({
                id: f.id,
                positiveVariant: f.positiveVariant,
                negativeVariant: f.negativeVariant,
            })),
            metrics: (category.metrics ?? []).map((m) => ({
                id: m.id,
                name: m.name,
                higherIsBetter: m.higherIsBetter,
            })),
        };
    }

    /** @deprecated use findOneWithCriteria */
    async findOne(id: number) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async create(dto: CreateCategoryDto) {
        const category = this.categoryRepo.create({
            slug: dto.slug,
            name: dto.name,
        });

        category.factors =
            dto.factorIds && dto.factorIds.length > 0
                ? await this.factorRepo.findBy({ id: In(dto.factorIds) })
                : [];

        category.metrics =
            dto.metricIds && dto.metricIds.length > 0
                ? await this.metricRepo.findBy({ id: In(dto.metricIds) })
                : [];

        return this.categoryRepo.save(category);
    }

    async rename(id: number, dto: RenameCategoryDto) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        await this.categoryRepo.update(id, dto as DeepPartial<Category>);
        return { ...category, ...dto };
    }

    async updateCriteria(id: number, dto: UpdateCategoryCriteriaDto) {
        const category = await this.categoryRepo.findOne({
            where: { id },
            relations: ['factors', 'metrics'],
        });
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);

        category.factors =
            dto.factorIds.length > 0
                ? await this.factorRepo.findBy({ id: In(dto.factorIds) })
                : [];

        category.metrics =
            dto.metricIds.length > 0
                ? await this.metricRepo.findBy({ id: In(dto.metricIds) })
                : [];

        const updated = await this.categoryRepo.save(category);

        return {
            id: updated.id,
            slug: updated.slug,
            name: updated.name,
            factors: (updated.factors ?? []).map((f) => ({
                id: f.id,
                positiveVariant: f.positiveVariant,
                negativeVariant: f.negativeVariant,
            })),
            metrics: (updated.metrics ?? []).map((m) => ({
                id: m.id,
                name: m.name,
                higherIsBetter: m.higherIsBetter,
            })),
        };
    }

    async remove(id: number) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) throw new NotFoundException('Category not found');

        await this.categoryRepo.delete(id);

        this.eventEmitter.emit(
            CategoryDeletedEvent.eventName,
            new CategoryDeletedEvent(id),
        );

        return { success: true };
    }

    @OnEvent(FactorDeletedEvent.eventName)
    async handleFactorDeletedEvent(payload: FactorDeletedEvent) {
        this.logger.info(
            { factorId: payload.factorId },
            'Factor deleted. Removing it from all categories...',
        );
        const categoriesWithFactor = await this.categoryRepo
            .createQueryBuilder('category')
            .innerJoin('category.factors', 'factor')
            .where('factor.id IN (:...ids)', { ids: [payload.factorId] })
            .getMany();

        const updatePromises = categoriesWithFactor.map(async (cat) => {
            const full = await this.categoryRepo.findOne({
                where: { id: cat.id },
                relations: ['factors', 'metrics'],
            });
            if (!full) return;
            full.factors = full.factors.filter(
                (f) => f.id !== payload.factorId,
            );
            return this.categoryRepo.save(full);
        });

        await Promise.all(updatePromises);
    }

    @OnEvent(MetricDeletedEvent.eventName)
    async handleMetricDeletedEvent(payload: MetricDeletedEvent) {
        this.logger.info(
            { metricId: payload.metricId },
            'Metric deleted. Removing it from all categories...',
        );
        const categoriesWithMetric = await this.categoryRepo
            .createQueryBuilder('category')
            .innerJoin('category.metrics', 'metric')
            .where('metric.id IN (:...ids)', { ids: [payload.metricId] })
            .getMany();

        const updatePromises = categoriesWithMetric.map(async (cat) => {
            const full = await this.categoryRepo.findOne({
                where: { id: cat.id },
                relations: ['factors', 'metrics'],
            });
            if (!full) return;
            full.metrics = full.metrics.filter(
                (m) => m.id !== payload.metricId,
            );
            return this.categoryRepo.save(full);
        });

        await Promise.all(updatePromises);
    }
}
