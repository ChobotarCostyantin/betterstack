import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

import { Software } from './entities/software.entity';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { CategoryDeletedEvent } from '@common/events/category.events';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    SoftwareListItemDto,
    SoftwareDetailDto,
    SoftwareFactorDto,
    SoftwareMetricDto,
} from './dto/software-response.dto';

@Injectable()
export class SoftwareService implements OnModuleInit {
    constructor(
        @InjectRepository(Software)
        private readonly repo: Repository<Software>,
    ) {}

    async onModuleInit() {
        const count = await this.repo.count();
        if (count === 0) {
            console.log('[Software] Database is empty. Seeding...');
            await this.repo.save([
                {
                    slug: 'jetbrains-rider',
                    name: 'JetBrains Rider',
                    developer: 'JetBrains',
                    shortDescription: 'The cross-platform .NET IDE.',
                    fullDescription:
                        '## Overview\nRider is an excellent choice for .NET developers.',
                    websiteUrl: 'https://jetbrains.com/rider',
                    screenshotUrls: [],
                },
                {
                    slug: 'visual-studio-code',
                    name: 'Visual Studio Code',
                    developer: 'Microsoft',
                    shortDescription: 'The code editor.',
                    logoUrl:
                        'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
                    websiteUrl: 'https://code.visualstudio.com/',
                    screenshotUrls: [],
                },
            ]);
        }
    }

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
                'softwareFactors.factor',
                'softwareMetrics',
                'softwareMetrics.metric',
            ],
        });
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const factors: SoftwareFactorDto[] = (sw.softwareFactors ?? []).map(
            (sf) => ({
                id: sf.id,
                name: sf.name,
                isPositive: sf.isPositive,
            }),
        );

        const metrics: SoftwareMetricDto[] = (sw.softwareMetrics ?? []).map(
            (sm) => ({
                id: sm.id,
                metricId: sm.metric?.id ?? sm.id,
                name: sm.metric?.name ?? '',
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
        console.log(
            `[Event] Category ${payload.categoryId} deleted. Removing it from all software...`,
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
        console.log(
            `[Event] User ${payload.userId} marked software ${payload.softwareId} as used. Incrementing usageCount...`,
        );
        await this.repo.increment({ id: payload.softwareId }, 'usageCount', 1);
    }

    @OnEvent(SoftwareMarkedUnusedEvent.eventName)
    async handleSoftwareMarkedUnused(payload: SoftwareMarkedUnusedEvent) {
        console.log(
            `[Event] User ${payload.userId} unmarked software ${payload.softwareId}. Decrementing usageCount...`,
        );
        await this.repo
            .createQueryBuilder()
            .update(Software)
            .set({ usageCount: () => 'GREATEST("usage_count" - 1, 0)' })
            .where('id = :id', { id: payload.softwareId })
            .execute();
    }
}
