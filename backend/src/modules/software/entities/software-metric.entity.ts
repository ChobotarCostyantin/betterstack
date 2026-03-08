import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Software } from './software.entity';
import type { Metric } from '@modules/criteria/entities/metric.entity';

@Entity('software_metrics')
export class SoftwareMetric {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'numeric' })
    value: number;

    @ManyToOne(() => Software, (software) => software.softwareMetrics, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_id' })
    software: Software;

    @ManyToOne('Metric', {
        onDelete: 'CASCADE',
        eager: false,
    })
    @JoinColumn({ name: 'metric_id' })
    metric: Metric;
}
