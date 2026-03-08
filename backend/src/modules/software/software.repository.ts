import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Software } from './entities/software.entity';

@Injectable()
export class SoftwareRepository implements OnModuleInit {
    constructor(
        @InjectRepository(Software)
        private readonly ormRepo: Repository<Software>,
    ) {}

    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Software] Database is empty. Seeding...');
            await this.ormRepo.save([
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

    findAll() {
        return this.ormRepo.find();
    }

    findById(id: number) {
        return this.ormRepo.findOneBy({ id });
    }

    findBySlug(slug: string) {
        return this.ormRepo.findOneBy({ slug });
    }

    create(dto: DeepPartial<Software>) {
        return this.ormRepo.save(dto);
    }

    update(id: number, dto: DeepPartial<Software>) {
        return this.ormRepo.update(id, dto);
    }

    delete(id: number) {
        return this.ormRepo.delete(id);
    }

    findWithCategoryId(categoryId: number) {
        return this.ormRepo
            .createQueryBuilder('software')
            .innerJoin('software.categories', 'category')
            .where('category.id = :categoryId', { categoryId })
            .getMany();
    }

    findByIdWithCategories(id: number) {
        return this.ormRepo.findOne({
            where: { id },
            relations: ['categories'],
        });
    }

    save(entity: Software) {
        return this.ormRepo.save(entity);
    }

    incrementUsageCount(id: number) {
        return this.ormRepo.increment({ id }, 'usageCount', 1);
    }

    async decrementUsageCount(id: number) {
        await this.ormRepo
            .createQueryBuilder()
            .update(Software)
            .set({ usageCount: () => 'GREATEST("usage_count" - 1, 0)' })
            .where('id = :id', { id })
            .execute();
    }
}
