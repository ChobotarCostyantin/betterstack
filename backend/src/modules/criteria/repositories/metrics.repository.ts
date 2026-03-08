import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Metric } from '../entities/metric.entity';
import { CreateMetricDto } from '../dto/create-metric.dto';
import { UpdateMetricDto } from '../dto/update-metric.dto';

@Injectable()
export class MetricsRepository {
    constructor(
        @InjectRepository(Metric)
        private readonly ormRepo: Repository<Metric>,
    ) {}

    findAll(): Promise<Metric[]> {
        return this.ormRepo.find();
    }

    findByCategories(categoryIds: number[]): Promise<Metric[]> {
        return this.ormRepo
            .createQueryBuilder('metric')
            .innerJoin('metric.categories', 'category')
            .where('category.id IN (:...categoryIds)', { categoryIds })
            .getMany();
    }

    findById(id: number): Promise<Metric | null> {
        return this.ormRepo.findOneBy({ id });
    }

    findByIds(ids: number[]): Promise<Metric[]> {
        return this.ormRepo.findBy({ id: In(ids) });
    }

    create(dto: CreateMetricDto): Promise<Metric> {
        return this.ormRepo.save(this.ormRepo.create(dto));
    }

    async update(id: number, dto: UpdateMetricDto): Promise<Metric | null> {
        await this.ormRepo.update(id, dto as DeepPartial<Metric>);
        return this.ormRepo.findOneBy({ id });
    }

    delete(id: number) {
        return this.ormRepo.delete(id);
    }
}
