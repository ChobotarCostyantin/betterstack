import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Criterion, CriterionType } from '../entities/criterion.entity';
import { CreateCriterionDto } from '../dto/create-criterion.dto';

@Injectable()
export class CriteriaRepository {
    constructor(
        @InjectRepository(Criterion)
        private readonly ormRepo: Repository<Criterion>,
    ) {}

    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log(
                '[Criteria] Database is empty. Seeding default criteria...',
            );
            await this.ormRepo.save([
                {
                    name: 'Cross-platform',
                    type: CriterionType.BOOLEAN,
                    value: 1,
                    higherIsBetter: true,
                }, // ID: 1
                {
                    name: 'Startup Time (sec)',
                    type: CriterionType.NUMERIC,
                    value: 3,
                    higherIsBetter: false,
                }, // ID: 2
                {
                    name: 'Price (USD)',
                    type: CriterionType.NUMERIC,
                    value: 0,
                    higherIsBetter: false,
                }, // ID: 3
                {
                    name: 'Memory Safety',
                    type: CriterionType.BOOLEAN,
                    value: 1,
                    higherIsBetter: true,
                }, // ID: 4
                {
                    name: 'Learning Curve',
                    type: CriterionType.NUMERIC,
                    value: 5,
                    higherIsBetter: false,
                }, // ID: 5
            ]);
        }
    }

    findAll() {
        return this.ormRepo.find();
    }
    findById(id: number) {
        return this.ormRepo.findOneBy({ id });
    }
    create(dto: CreateCriterionDto) {
        return this.ormRepo.save(dto);
    }
    update(id: number, dto: DeepPartial<Criterion>) {
        return this.ormRepo.update(id, dto);
    }
    delete(id: number) {
        return this.ormRepo.delete(id);
    }
}
