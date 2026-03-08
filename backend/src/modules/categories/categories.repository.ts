import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private readonly ormRepo: Repository<Category>,
    ) {}

    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log(
                '[Categories] Database is empty. Seeding default categories...',
            );
            await this.ormRepo.save([
                { slug: 'ides', name: 'IDEs & Editors' },
                { slug: 'databases', name: 'Database Clients' },
                { slug: 'languages', name: 'Programming Languages' },
            ]);
        }
    }

    findAll() {
        return this.ormRepo.find();
    }

    findById(id: number) {
        return this.ormRepo.findOneBy({ id });
    }

    findWithCriteriaIds(ids: number[]) {
        return this.ormRepo
            .createQueryBuilder('category')
            .innerJoin('category.criteria', 'criterion')
            .where('criterion.id IN (:...ids)', { ids })
            .getMany();
    }

    create(dto: CreateCategoryDto) {
        return this.ormRepo.save(dto);
    }

    update(id: number, dto: DeepPartial<Category>) {
        return this.ormRepo.update(id, dto);
    }

    delete(id: number) {
        return this.ormRepo.delete(id);
    }

    findByIdWithCriteria(id: number) {
        return this.ormRepo.findOne({ where: { id }, relations: ['criteria'] });
    }

    save(entity: Category) {
        return this.ormRepo.save(entity);
    }
}
