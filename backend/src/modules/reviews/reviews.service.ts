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
import { User } from '../users/entities/user.entity';
import {
    SoftwareReviewResponseDto,
    CreateSoftwareReviewDto,
    UpdateSoftwareReviewDto,
    CreateSoftwareComparisonReviewDto,
    UpdateSoftwareComparisonReviewDto,
    UpdateAuthorDetailsDto,
    AuthorDetailsWithUserDto,
} from './dto/reviews.dto';
import { Role } from '@common/enums/role.enum';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(SoftwareReview)
        private readonly swReviewRepo: Repository<SoftwareReview>,
        @InjectRepository(SoftwareComparisonReview)
        private readonly cmpReviewRepo: Repository<SoftwareComparisonReview>,
        @InjectRepository(AuthorDetails)
        private readonly authorRepo: Repository<AuthorDetails>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    private async getOrCreateAuthorDetails(
        userId: number,
    ): Promise<AuthorDetails> {
        let author = await this.authorRepo.findOneBy({ userId });
        if (!author) {
            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user)
                throw new NotFoundException(`User with ID ${userId} not found`);

            const newAuthor = this.authorRepo.create({
                userId: userId,
                fullName: user.email.split('@')[0],
                bio: 'Software Author',
            });
            author = await this.authorRepo.save(newAuthor);
        }
        return author;
    }

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
        userId: number,
        dto: CreateSoftwareReviewDto,
    ): Promise<SoftwareReviewResponseDto> {
        const existing = await this.swReviewRepo.findOne({
            where: { softwareSlug: dto.softwareSlug },
        });

        if (existing) {
            throw new BadRequestException(
                `Review for software '${dto.softwareSlug}' already exists`,
            );
        }

        const author = await this.getOrCreateAuthorDetails(userId);

        const review = this.swReviewRepo.create({
            softwareSlug: dto.softwareSlug,
            content: dto.content,
            authorDetailsId: author.id,
        });

        const saved = await this.swReviewRepo.save(review);
        const fullReview = await this.swReviewRepo.findOne({
            where: { id: saved.id },
            relations: ['author'],
        });
        return this.mapToResponseDto(fullReview!);
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
        userId: number,
        dto: CreateSoftwareComparisonReviewDto,
    ): Promise<SoftwareReviewResponseDto> {
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

        const author = await this.getOrCreateAuthorDetails(userId);

        const review = this.cmpReviewRepo.create({
            softwareSlugA: dto.softwareSlugA,
            softwareSlugB: dto.softwareSlugB,
            content: dto.content,
            authorDetailsId: author.id,
        });

        const saved = await this.cmpReviewRepo.save(review);
        const fullReview = await this.cmpReviewRepo.findOne({
            where: { id: saved.id },
            relations: ['author'],
        });
        return this.mapToResponseDto(fullReview!);
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

    async listAuthors(): Promise<AuthorDetailsWithUserDto[]> {
        const authors = await this.authorRepo.find({
            relations: ['user'],
        });

        // Filter only those whose current role is admin or author
        const filtered = authors.filter(
            (a) =>
                a.user &&
                (a.user.role === Role.ADMIN || a.user.role === Role.AUTHOR),
        );

        return filtered.map((a) => ({
            id: a.id,
            userId: a.userId,
            fullName: a.fullName,
            bio: a.bio,
            avatarUrl: a.avatarUrl,
            websiteUrl: a.websiteUrl,
            userEmail: a.user.email,
            userRole: a.user.role,
        }));
    }

    async updateAuthorDetails(
        id: number,
        dto: UpdateAuthorDetailsDto,
    ): Promise<{ success: boolean }> {
        const author = await this.authorRepo.findOneBy({ id });
        if (!author) {
            throw new NotFoundException(
                `AuthorDetails with ID ${id} not found`,
            );
        }

        author.fullName = dto.fullName;
        author.bio = dto.bio;
        author.avatarUrl = dto.avatarUrl;
        author.websiteUrl = dto.websiteUrl;

        await this.authorRepo.save(author);
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
                userId: review.author.userId,
                fullName: review.author.fullName,
                bio: review.author.bio,
                avatarUrl: review.author.avatarUrl,
                websiteUrl: review.author.websiteUrl,
            },
        };
    }
}
