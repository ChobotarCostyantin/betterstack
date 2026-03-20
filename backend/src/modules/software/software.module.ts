import { Module } from '@nestjs/common';
import { SoftwareController } from './software.controller';
import { SoftwareQueryService } from './services/software-query.service';
import { SoftwareManagementService } from './services/software-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Software } from './entities/software.entity';
import { SoftwareFactor } from './entities/software-factor.entity';
import { SoftwareMetric } from './entities/software-metric.entity';
import { CriteriaModule } from '@modules/criteria/criteria.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Software, SoftwareFactor, SoftwareMetric]),
        CriteriaModule,
    ],
    controllers: [SoftwareController],
    providers: [SoftwareQueryService, SoftwareManagementService],
})
export class SoftwareModule {}
