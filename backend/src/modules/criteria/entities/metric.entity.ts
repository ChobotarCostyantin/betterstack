import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import type { Category } from '@modules/categories/entities/category.entity';

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
}
