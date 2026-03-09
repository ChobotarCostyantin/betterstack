import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Software } from './software.entity';
import type { Factor } from '@modules/criteria/entities/factor.entity';

@Entity('software_factors')
export class SoftwareFactor {
    @PrimaryColumn({ name: 'software_id' })
    softwareId: number;

    @PrimaryColumn({ name: 'factor_id' })
    factorId: number;

    @Column({ length: 50 })
    factorName: string;

    @Column()
    isPositive: boolean;

    @ManyToOne(() => Software, (software) => software.softwareFactors, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'software_id' })
    software: Software;

    @ManyToOne('Factor', {
        onDelete: 'CASCADE',
        eager: false,
    })
    @JoinColumn({ name: 'factor_id' })
    factor: Factor;
}
