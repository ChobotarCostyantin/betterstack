import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { AuthorDetails } from './author-details.entity';

@Entity('software_reviews')
export class SoftwareReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    softwareSlug: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    authorDetailsId: number;

    @ManyToOne(() => AuthorDetails, (author) => author.softwareReviews)
    @JoinColumn({ name: 'authorDetailsId' })
    author: AuthorDetails;
}
