import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorDetails } from './entities/author-details.entity';
import { SoftwareReview } from './entities/software-review.entity';
import { SoftwareComparisonReview } from './entities/software-comparison-review.entity';
import {
    SoftwareReviewResponseDto,
    CreateSoftwareReviewDto,
    UpdateSoftwareReviewDto,
    CreateSoftwareComparisonReviewDto,
    UpdateSoftwareComparisonReviewDto,
} from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(SoftwareReview)
        private readonly swReviewRepo: Repository<SoftwareReview>,
        @InjectRepository(SoftwareComparisonReview)
        private readonly cmpReviewRepo: Repository<SoftwareComparisonReview>,
        @InjectRepository(AuthorDetails)
        private readonly authorRepo: Repository<AuthorDetails>,
    ) {}

    async getSoftwareReviewBySlug(
        slug: string,
    ): Promise<SoftwareReviewResponseDto> {
        const review = await this.swReviewRepo.findOne({
            where: { softwareSlug: slug },
            relations: ['author'],
        });

        if (!review) {
            throw new NotFoundException(
                `Review for software '${slug}' not found`,
            );
        }

        return this.mapToResponseDto(review);
    }

    async createSoftwareReview(
        dto: CreateSoftwareReviewDto,
    ): Promise<{ id: number }> {
        const existing = await this.swReviewRepo.findOne({
            where: { softwareSlug: dto.softwareSlug },
        });

        if (existing) {
            throw new BadRequestException(
                `Review for software '${dto.softwareSlug}' already exists`,
            );
        }

        const author = await this.authorRepo.findOneBy({
            id: dto.authorDetailsId,
        });
        if (!author) {
            throw new NotFoundException(
                `AuthorDetails with ID ${dto.authorDetailsId} not found`,
            );
        }

        const review = this.swReviewRepo.create({
            softwareSlug: dto.softwareSlug,
            content: dto.content,
            authorDetailsId: dto.authorDetailsId,
        });

        const saved = await this.swReviewRepo.save(review);
        return { id: saved.id };
    }

    async updateSoftwareReview(
        id: number,
        dto: UpdateSoftwareReviewDto,
    ): Promise<{ success: boolean }> {
        const review = await this.swReviewRepo.findOneBy({ id });
        if (!review) {
            throw new NotFoundException(
                `SoftwareReview with ID ${id} not found`,
            );
        }

        if (dto.content !== undefined) {
            review.content = dto.content;
        }

        await this.swReviewRepo.save(review);
        return { success: true };
    }

    async deleteSoftwareReview(id: number): Promise<{ success: boolean }> {
        const res = await this.swReviewRepo.delete(id);
        if (res.affected === 0) {
            throw new NotFoundException(
                `SoftwareReview with ID ${id} not found`,
            );
        }
        return { success: true };
    }

    async getSoftwareComparisonReview(
        slugA: string,
        slugB: string,
    ): Promise<SoftwareReviewResponseDto> {
        const review = await this.cmpReviewRepo.findOne({
            where: [
                { softwareSlugA: slugA, softwareSlugB: slugB },
                { softwareSlugA: slugB, softwareSlugB: slugA },
            ],
            relations: ['author'],
        });

        if (!review) {
            throw new NotFoundException(
                `Comparison review for '${slugA}' and '${slugB}' not found`,
            );
        }

        return this.mapToResponseDto(review);
    }

    async createSoftwareComparisonReview(
        dto: CreateSoftwareComparisonReviewDto,
    ): Promise<{ id: number }> {
        const existing = await this.cmpReviewRepo.findOne({
            where: [
                {
                    softwareSlugA: dto.softwareSlugA,
                    softwareSlugB: dto.softwareSlugB,
                },
                {
                    softwareSlugA: dto.softwareSlugB,
                    softwareSlugB: dto.softwareSlugA,
                },
            ],
        });

        if (existing) {
            throw new BadRequestException(
                `Comparison review for '${dto.softwareSlugA}' and '${dto.softwareSlugB}' already exists`,
            );
        }

        const author = await this.authorRepo.findOneBy({
            id: dto.authorDetailsId,
        });
        if (!author) {
            throw new NotFoundException(
                `AuthorDetails with ID ${dto.authorDetailsId} not found`,
            );
        }

        const review = this.cmpReviewRepo.create({
            softwareSlugA: dto.softwareSlugA,
            softwareSlugB: dto.softwareSlugB,
            content: dto.content,
            authorDetailsId: dto.authorDetailsId,
        });

        const saved = await this.cmpReviewRepo.save(review);
        return { id: saved.id };
    }

    async updateSoftwareComparisonReview(
        id: number,
        dto: UpdateSoftwareComparisonReviewDto,
    ): Promise<{ success: boolean }> {
        const review = await this.cmpReviewRepo.findOneBy({ id });
        if (!review) {
            throw new NotFoundException(
                `SoftwareComparisonReview with ID ${id} not found`,
            );
        }

        if (dto.content !== undefined) {
            review.content = dto.content;
        }

        await this.cmpReviewRepo.save(review);
        return { success: true };
    }

    async deleteSoftwareComparisonReview(
        id: number,
    ): Promise<{ success: boolean }> {
        const res = await this.cmpReviewRepo.delete(id);
        if (res.affected === 0) {
            throw new NotFoundException(
                `SoftwareComparisonReview with ID ${id} not found`,
            );
        }
        return { success: true };
    }

    private mapToResponseDto(
        review: SoftwareReview | SoftwareComparisonReview,
    ): SoftwareReviewResponseDto {
        return {
            id: review.id,
            content: review.content,
            author: {
                id: review.author.id,
                fullName: review.author.fullName,
                bio: review.author.bio,
                avatarUrl: review.author.avatarUrl,
                websiteUrl: review.author.websiteUrl,
            },
        };
    }
}
