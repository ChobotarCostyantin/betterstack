import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import type { Category } from '@modules/categories/entities/category.entity';
import { SoftwareFactor } from './software-factor.entity';
import { SoftwareMetric } from './software-metric.entity';
import { SoftwareComparisonNote } from './software-comparison-note.entity';

@Entity('software')
export class Software {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    slug: string;

    @Column({ type: 'varchar', unique: true, length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    developer: string;

    @Column({ type: 'varchar', length: 255 })
    shortDescription: string;

    @Column({ type: 'text', nullable: true })
    fullDescription: string | null;

    @Column({ type: 'varchar', nullable: true })
    websiteUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    gitRepoUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    logoUrl: string | null;

    @Column('text', { array: true, default: [] })
    screenshotUrls: string[];

    @Column({ type: 'int', default: 0 })
    usageCount: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToMany('Category')
    @JoinTable({
        name: 'software_categories',
        joinColumn: { name: 'software_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];

    @OneToMany(() => SoftwareFactor, (sf) => sf.software)
    softwareFactors: SoftwareFactor[];

    @OneToMany(() => SoftwareMetric, (sm) => sm.software)
    softwareMetrics: SoftwareMetric[];

    @OneToMany(() => SoftwareComparisonNote, (note) => note.softwareA)
    comparisonsAsA: SoftwareComparisonNote[];

    @OneToMany(() => SoftwareComparisonNote, (note) => note.softwareB)
    comparisonsAsB: SoftwareComparisonNote[];
}
