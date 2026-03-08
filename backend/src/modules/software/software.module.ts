import { Module } from '@nestjs/common';
import { SoftwareController } from './software.controller';
import { SoftwareService } from './software.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Software } from './entities/software.entity';
import { SoftwareFactor } from './entities/software-factor.entity';
import { SoftwareMetric } from './entities/software-metric.entity';
import { SoftwareComparisonNote } from './entities/software-comparison-note.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Software,
            SoftwareFactor,
            SoftwareMetric,
            SoftwareComparisonNote,
        ]),
    ],
    controllers: [SoftwareController],
    providers: [SoftwareService],
})
export class SoftwareModule {}
