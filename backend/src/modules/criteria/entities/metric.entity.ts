import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Category } from '@modules/categories/entities/category.entity';

@Entity('metrics')
export class Metric {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ default: true })
    higherIsBetter: boolean;

    @ManyToMany(() => Category, (category) => category.metrics)
    categories: Category[];
}
