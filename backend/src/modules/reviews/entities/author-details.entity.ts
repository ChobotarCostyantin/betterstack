import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { SoftwareReview } from './software-review.entity';
import { SoftwareComparisonReview } from './software-comparison-review.entity';

@Entity('author_details')
export class AuthorDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    fullName: string;

    @Column({ type: 'text' })
    bio: string;

    @Column({ type: 'varchar', nullable: true })
    avatarUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    websiteUrl: string | null;

    @OneToMany(() => SoftwareReview, (review) => review.author)
    softwareReviews: SoftwareReview[];

    @OneToMany(() => SoftwareComparisonReview, (review) => review.author)
    softwareComparisonReviews: SoftwareComparisonReview[];
}
