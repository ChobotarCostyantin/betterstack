import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factor } from './entities/factor.entity';
import { Metric } from './entities/metric.entity';
import { FactorsRepository } from './repositories/factors.repository';
import { MetricsRepository } from './repositories/metrics.repository';
import { FactorsService } from './services/factors.service';
import { MetricsService } from './services/metrics.service';
import { FactorsController } from './controllers/factors.controller';
import { MetricsController } from './controllers/metrics.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Factor, Metric])],
    controllers: [FactorsController, MetricsController],
    providers: [
        FactorsService,
        MetricsService,
        FactorsRepository,
        MetricsRepository,
    ],
})
export class CriteriaModule {}
