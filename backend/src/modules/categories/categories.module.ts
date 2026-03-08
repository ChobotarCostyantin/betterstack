import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Factor } from '@modules/criteria/entities/factor.entity';
import { Metric } from '@modules/criteria/entities/metric.entity';
import { CategoriesRepository } from './categories.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Factor, Metric])],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
