import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Software } from './software.entity';
import type { Metric } from '@modules/criteria/entities/metric.entity';

@Entity('software_metrics')
export class SoftwareMetric {
    @PrimaryColumn({ name: 'software_id' })
    softwareId: number;

    @PrimaryColumn({ name: 'metric_id' })
    metricId: number;

    @Column({ type: 'numeric' })
    value: number;

    @Column({ length: 50 })
    metricName: string;

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
