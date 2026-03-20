import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('software_reviews')
export class SoftwareReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    softwareSlug: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.softwareReviews)
    @JoinColumn({ name: 'userId' })
    author: User;
}
