import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ArrayContains } from 'typeorm';
import { Software } from '../entities/software.entity';

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
                    categoryIds: [1],
                    name: 'JetBrains Rider',
                    developer: 'JetBrains',
                    shortDescription: 'The cross-platform .NET IDE.',
                    fullDescription:
                        '## Overview\nRider is an excellent choice for .NET developers.',
                    websiteUrl: 'https://jetbrains.com/rider',
                    features: { '1': true, '2': 3.2 },
                },
                {
                    categoryIds: [1],
                    name: 'Visual Studio Code',
                    developer: 'Microsoft',
                    shortDescription: 'The code editor.',
                    logoUrl:
                        'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
                    websiteUrl: 'https://code.visualstudio.com/',
                    features: { '1': true, '2': 3.2 },
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
    create(dto: any) {
        return this.ormRepo.save(dto);
    }
    update(id: number, dto: any) {
        return this.ormRepo.update(id, dto);
    }
    delete(id: number) {
        return this.ormRepo.delete(id);
    }

    deleteByCategoryId(categoryId: number) {
        return this.ormRepo.delete({
            categoryIds: ArrayContains([categoryId]),
        });
    }

    findWithCategoryId(categoryId: number) {
        return this.ormRepo.find({
            where: {
                categoryIds: ArrayContains([categoryId]),
            },
        });
    }
}
