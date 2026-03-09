import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Factor } from '@modules/criteria/entities/factor.entity';
import { Metric } from '@modules/criteria/entities/metric.entity';
import type { Software } from '@modules/software/entities/software.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column({ length: 50 })
    name: string;

    @ManyToMany(() => Factor, (factor) => factor.categories)
    @JoinTable({
        name: 'category_factors',
        joinColumn: { name: 'category_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'factor_id', referencedColumnName: 'id' },
    })
    factors: Factor[];

    @ManyToMany(() => Metric, (metric) => metric.categories)
    @JoinTable({
        name: 'category_metrics',
        joinColumn: { name: 'category_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'metric_id', referencedColumnName: 'id' },
    })
    metrics: Metric[];

    @ManyToMany('Software', 'categories')
    softwares: Software[];
}
