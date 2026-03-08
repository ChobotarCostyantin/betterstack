import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Criterion } from '@modules/criteria/entities/criterion.entity';
import { CategoriesRepository } from './categories.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Criterion])],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
