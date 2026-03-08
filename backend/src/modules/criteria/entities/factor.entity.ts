import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import type { Category } from '@modules/categories/entities/category.entity';
import type { SoftwareFactor } from '@modules/software/entities/software-factor.entity';

@Entity('factors')
export class Factor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    positiveVariant: string;

    @Column({ length: 50, unique: true })
    negativeVariant: string;

    @ManyToMany('Category', 'factors')
    categories: Category[];

    @OneToMany('SoftwareFactor', 'factor')
    softwareFactors: SoftwareFactor[];
}
