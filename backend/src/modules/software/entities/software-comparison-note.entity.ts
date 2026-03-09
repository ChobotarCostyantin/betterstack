import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Software } from './software.entity';

@Entity('software_comparison_notes')
export class SoftwareComparisonNote {
    @PrimaryColumn({ name: 'software_a_id' })
    softwareAId: number;

    @PrimaryColumn({ name: 'software_b_id' })
    softwareBId: number;

    @Column({ type: 'text' })
    note: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => Software, (software) => software.comparisonsAsA, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_a_id' })
    softwareA: Software;

    @ManyToOne(() => Software, (software) => software.comparisonsAsB, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_b_id' })
    softwareB: Software;
}
