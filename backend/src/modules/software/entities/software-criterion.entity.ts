import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Software } from './software.entity';
import {
    Criterion,
    CriterionType,
} from '@modules/criteria/entities/criterion.entity';

@Entity('software_criteria')
export class SoftwareCriterion {
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

    @ManyToOne(() => Software, (software) => software.softwareCriteria, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_id' })
    software: Software;

    @ManyToOne(() => Criterion, (criterion) => criterion.softwareCriteria, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'criterion_id' })
    criterion: Criterion;
}
