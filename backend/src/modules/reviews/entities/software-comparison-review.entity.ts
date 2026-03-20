import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { AuthorDetails } from './author-details.entity';

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
    authorDetailsId: number;

    @ManyToOne(
        () => AuthorDetails,
        (author) => author.softwareComparisonReviews,
    )
    @JoinColumn({ name: 'authorDetailsId' })
    author: AuthorDetails;
}
