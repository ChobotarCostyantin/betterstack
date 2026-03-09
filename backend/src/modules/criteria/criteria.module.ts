import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factor } from './entities/factor.entity';
import { Metric } from './entities/metric.entity';
import { FactorsService } from './services/factors.service';
import { MetricsService } from './services/metrics.service';
import { FactorsController } from './controllers/factors.controller';
import { MetricsController } from './controllers/metrics.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Factor, Metric])],
    controllers: [FactorsController, MetricsController],
    providers: [FactorsService, MetricsService],
    exports: [FactorsService, MetricsService],
})
export class CriteriaModule {}
