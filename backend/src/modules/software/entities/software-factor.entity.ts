import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Software } from './software.entity';
import { Factor } from '@modules/criteria/entities/factor.entity';

@Entity('software_factors')
export class SoftwareFactor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column()
    isPositive: boolean;

    @ManyToOne(() => Software, (software) => software.softwareFactors, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_id' })
    software: Software;

    @ManyToOne(() => Factor, (factor) => factor.softwareFactors, {
        onDelete: 'CASCADE',
        eager: false,
    })
    @JoinColumn({ name: 'factor_id' })
    factor: Factor;
}
