import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import type { SoftwareUsage } from './software-usage.entity';
import type { SoftwareReview } from '../../reviews/entities/software-review.entity';
import type { SoftwareComparisonReview } from '../../reviews/entities/software-comparison-review.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: 'varchar', default: Role.USER })
    role: Role;

    @Column({ type: 'varchar', nullable: true })
    fullName: string | null;

    @Column({ type: 'text', nullable: true })
    bio: string | null;

    @Column({ type: 'varchar', nullable: true })
    avatarUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    websiteUrl: string | null;

    @OneToMany('SoftwareUsage', 'user')
    softwareUsages: SoftwareUsage[];

    @OneToMany('SoftwareReview', 'author')
    softwareReviews: SoftwareReview[];

    @OneToMany('SoftwareComparisonReview', 'author')
    softwareComparisonReviews: SoftwareComparisonReview[];
}
