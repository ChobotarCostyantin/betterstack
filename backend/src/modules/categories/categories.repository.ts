import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Criterion } from '@modules/criteria/entities/criterion.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private readonly ormRepo: Repository<Category>,
        @InjectRepository(Criterion)
        private readonly criterionRepo: Repository<Criterion>,
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

    async findAllPaginated(
        page: number,
        perPage: number,
    ): Promise<[Category[], number]> {
        return this.ormRepo.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            order: { id: 'ASC' },
        });
    }

    findById(id: number) {
        return this.ormRepo.findOneBy({ id });
    }

    findByIdList(ids: number[]) {
        return this.ormRepo.findBy({ id: In(ids) });
    }

    findWithCriteriaIds(ids: number[]) {
        return this.ormRepo
            .createQueryBuilder('category')
            .innerJoin('category.criteria', 'criterion')
            .where('criterion.id IN (:...ids)', { ids })
            .getMany();
    }

    async create(dto: CreateCategoryDto) {
        const category = this.ormRepo.create({
            slug: dto.slug,
            name: dto.name,
        });

        const criteriaIds = [
            ...(dto.booleanCriteriaIds ?? []),
            ...(dto.numericCriteriaIds ?? []),
        ];
        if (criteriaIds.length > 0) {
            category.criteria = await this.criterionRepo.findBy({
                id: In(criteriaIds),
            });
        } else {
            category.criteria = [];
        }

        return this.ormRepo.save(category);
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

    async findByIdsWithCriteria(ids: number[]) {
        return this.ormRepo.find({
            where: { id: In(ids) },
            relations: ['criteria'],
        });
    }

    async setCriteria(
        categoryId: number,
        booleanCriteriaIds: number[],
        numericCriteriaIds: number[],
    ) {
        const category = await this.findByIdWithCriteria(categoryId);
        if (!category) return null;

        const allIds = [...booleanCriteriaIds, ...numericCriteriaIds];
        category.criteria =
            allIds.length > 0
                ? await this.criterionRepo.findBy({ id: In(allIds) })
                : [];

        return this.ormRepo.save(category);
    }

    save(entity: Category) {
        return this.ormRepo.save(entity);
    }
}
