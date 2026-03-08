import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Criterion } from '@modules/criteria/entities/criterion.entity';
import type { Software } from '@modules/software/entities/software.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column({ length: 50 })
    name: string;

    @ManyToMany(() => Criterion, (criterion) => criterion.categories)
    @JoinTable({
        name: 'category_criteria',
        joinColumn: { name: 'category_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'criterion_id', referencedColumnName: 'id' },
    })
    criteria: Criterion[];

    @ManyToMany('Software', 'categories')
    softwares: Software[];
}
