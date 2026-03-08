import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeepPartial } from 'typeorm';

import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { Software } from './entities/software.entity';
import { SoftwareRepository } from './software.repository';
import { CategoryDeletedEvent } from '@common/events/category.events';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    SoftwareListItemDto,
    SoftwareDetailDto,
    SoftwareBooleanCriterionDto,
    SoftwareNumericCriterionDto,
} from './dto/software-response.dto';
import { CriterionType } from '../criteria/entities/criterion.entity';

@Injectable()
export class SoftwareService {
    constructor(private readonly repo: SoftwareRepository) {}

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
        const [items, total] = await this.repo.findPaginated(q, page, perPage);
        return new PaginatedResponseDto(
            items.map((sw) => this.toListItem(sw)),
            total,
            page,
            perPage,
        );
    }

    async findMostUsed(limit: number): Promise<SoftwareListItemDto[]> {
        const items = await this.repo.findMostUsed(limit);
        return items.map((sw) => this.toListItem(sw));
    }

    async findOneBySlug(slug: string): Promise<SoftwareDetailDto> {
        const sw = await this.repo.findBySlugWithRelations(slug);
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const booleanCriteria: SoftwareBooleanCriterionDto[] = (
            sw.softwareCriteria ?? []
        )
            .filter((sc) => sc.type === CriterionType.BOOLEAN)
            .map((sc) => ({
                id: sc.criterion?.id ?? sc.id,
                name: sc.name,
                isPositive: sc.value !== 0,
                value: sc.value,
            }));

        const numericCriteria: SoftwareNumericCriterionDto[] = (
            sw.softwareCriteria ?? []
        )
            .filter((sc) => sc.type === CriterionType.NUMERIC)
            .map((sc) => ({
                id: sc.criterion?.id ?? sc.id,
                name: sc.name,
                higherIsBetter: sc.higherIsBetter,
                value: sc.value,
            }));

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
            booleanCriteria,
            numericCriteria,
        };
    }

    async findAlternatives(
        slug: string,
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<SoftwareListItemDto>> {
        const sw = await this.repo.findBySlug(slug);
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const [items, total] = await this.repo.findAlternatives(
            sw.id,
            page,
            perPage,
        );
        return new PaginatedResponseDto(
            items.map((s) => this.toListItem(s)),
            total,
            page,
            perPage,
        );
    }

    /** @deprecated use findOneBySlug */
    async findOne(id: number) {
        const sw = await this.repo.findById(id);
        if (!sw)
            throw new NotFoundException(`Software with ID ${id} not found`);
        return sw;
    }

    async create(dto: CreateSoftwareDto): Promise<Software> {
        return this.repo.create(dto as DeepPartial<Software>);
    }

    async update(id: number, dto: UpdateSoftwareDto) {
        return this.repo.update(id, dto as DeepPartial<Software>);
    }

    async remove(id: number) {
        const soft = await this.repo.findById(id);
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

        const softwareList = await this.repo.findWithCategoryId(
            payload.categoryId,
        );

        const updatePromises = softwareList.map(async (sw) => {
            const swWithCategories = await this.repo.findByIdWithCategories(
                sw.id,
            );
            if (!swWithCategories) return;
            swWithCategories.categories = swWithCategories.categories.filter(
                (c) => c.id !== payload.categoryId,
            );
            return this.repo.save(swWithCategories);
        });

        await Promise.all(updatePromises);
    }

    @OnEvent(SoftwareMarkedUsedEvent.eventName)
    async handleSoftwareMarkedUsed(payload: SoftwareMarkedUsedEvent) {
        console.log(
            `[Event] User ${payload.userId} marked software ${payload.softwareId} as used. Incrementing usageCount...`,
        );
        await this.repo.incrementUsageCount(payload.softwareId);
    }

    @OnEvent(SoftwareMarkedUnusedEvent.eventName)
    async handleSoftwareMarkedUnused(payload: SoftwareMarkedUnusedEvent) {
        console.log(
            `[Event] User ${payload.userId} unmarked software ${payload.softwareId}. Decrementing usageCount...`,
        );
        await this.repo.decrementUsageCount(payload.softwareId);
    }
}
