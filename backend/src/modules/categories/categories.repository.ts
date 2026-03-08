import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Factor } from '@modules/criteria/entities/factor.entity';
import { Metric } from '@modules/criteria/entities/metric.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private readonly ormRepo: Repository<Category>,
        @InjectRepository(Factor)
        private readonly factorRepo: Repository<Factor>,
        @InjectRepository(Metric)
        private readonly metricRepo: Repository<Metric>,
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

    findWithFactorIds(ids: number[]) {
        return this.ormRepo
            .createQueryBuilder('category')
            .innerJoin('category.factors', 'factor')
            .where('factor.id IN (:...ids)', { ids })
            .getMany();
    }

    findWithMetricIds(ids: number[]) {
        return this.ormRepo
            .createQueryBuilder('category')
            .innerJoin('category.metrics', 'metric')
            .where('metric.id IN (:...ids)', { ids })
            .getMany();
    }

    async create(dto: CreateCategoryDto) {
        const category = this.ormRepo.create({
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

        return this.ormRepo.save(category);
    }

    update(id: number, dto: DeepPartial<Category>) {
        return this.ormRepo.update(id, dto);
    }

    delete(id: number) {
        return this.ormRepo.delete(id);
    }

    findByIdWithFactorsAndMetrics(id: number) {
        return this.ormRepo.findOne({
            where: { id },
            relations: ['factors', 'metrics'],
        });
    }

    async findByIdsWithFactorsAndMetrics(ids: number[]) {
        return this.ormRepo.find({
            where: { id: In(ids) },
            relations: ['factors', 'metrics'],
        });
    }

    async setFactorsAndMetrics(
        categoryId: number,
        factorIds: number[],
        metricIds: number[],
    ) {
        const category = await this.findByIdWithFactorsAndMetrics(categoryId);
        if (!category) return null;

        category.factors =
            factorIds.length > 0
                ? await this.factorRepo.findBy({ id: In(factorIds) })
                : [];

        category.metrics =
            metricIds.length > 0
                ? await this.metricRepo.findBy({ id: In(metricIds) })
                : [];

        return this.ormRepo.save(category);
    }

    save(entity: Category) {
        return this.ormRepo.save(entity);
    }
}
