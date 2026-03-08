import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Factor } from '../entities/factor.entity';
import { CreateFactorDto } from '../dto/create-factor.dto';
import { UpdateFactorDto } from '../dto/update-factor.dto';

@Injectable()
export class FactorsRepository {
    constructor(
        @InjectRepository(Factor)
        private readonly ormRepo: Repository<Factor>,
    ) {}

    findAll(): Promise<Factor[]> {
        return this.ormRepo.find();
    }

    findByCategories(categoryIds: number[]): Promise<Factor[]> {
        return this.ormRepo
            .createQueryBuilder('factor')
            .innerJoin('factor.categories', 'category')
            .where('category.id IN (:...categoryIds)', { categoryIds })
            .getMany();
    }

    findById(id: number): Promise<Factor | null> {
        return this.ormRepo.findOneBy({ id });
    }

    findByIds(ids: number[]): Promise<Factor[]> {
        return this.ormRepo.findBy({ id: In(ids) });
    }

    create(dto: CreateFactorDto): Promise<Factor> {
        return this.ormRepo.save(this.ormRepo.create(dto));
    }

    async update(id: number, dto: UpdateFactorDto): Promise<Factor | null> {
        await this.ormRepo.update(id, dto as DeepPartial<Factor>);
        return this.ormRepo.findOneBy({ id });
    }

    delete(id: number) {
        return this.ormRepo.delete(id);
    }
}
