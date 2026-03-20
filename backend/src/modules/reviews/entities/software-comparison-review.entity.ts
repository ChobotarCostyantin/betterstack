import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('software_comparison_reviews')
@Unique(['softwareSlugA', 'softwareSlugB'])
export class SoftwareComparisonReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    softwareSlugA: string;

    @Column()
    softwareSlugB: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.softwareComparisonReviews)
    @JoinColumn({ name: 'userId' })
    author: User;
}
