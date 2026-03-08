import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import type { Category } from '@modules/categories/entities/category.entity';
import type { SoftwareCriterion } from '@modules/software/entities/software-criterion.entity';

export enum CriterionType {
    BOOLEAN = 'BOOLEAN',
    NUMERIC = 'NUMERIC',
}

@Entity('criteria')
export class Criterion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    name: string;

    @Column({ type: 'enum', enum: CriterionType })
    type: CriterionType;

    @Column({ type: 'int', default: 0 })
    value: number;

    @Column({ default: true })
    higherIsBetter: boolean;

    @ManyToMany('Category', 'criteria')
    categories: Category[];

    @OneToMany('SoftwareCriterion', 'criterion')
    softwareCriteria: SoftwareCriterion[];
}
