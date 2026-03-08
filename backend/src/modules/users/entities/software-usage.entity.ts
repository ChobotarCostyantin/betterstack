import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import type { Software } from '@modules/software/entities/software.entity';

@Entity('software_usages')
export class SoftwareUsage {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'software_id' })
    softwareId: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.softwareUsages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Software', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'software_id' })
    software: Software;
}
