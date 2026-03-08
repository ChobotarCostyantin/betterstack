import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import type { Category } from '@modules/categories/entities/category.entity';
import type { SoftwareMetric } from '@modules/software/entities/software-metric.entity';

@Entity('metrics')
export class Metric {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ default: true })
    higherIsBetter: boolean;

    @ManyToMany('Category', 'metrics')
    categories: Category[];

    @OneToMany('SoftwareMetric', 'metric')
    softwareMetrics: SoftwareMetric[];
}
