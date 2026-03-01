import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('software')
export class Software {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { array: true, default: [] })
    categoryIds: number[];

    @Column()
    name: string;

    @Column({ nullable: true })
    developer: string;

    @Column({ length: 255 })
    shortDescription: string;

    @Column('text', { nullable: true })
    fullDescription: string;

    @Column({ nullable: true })
    websiteUrl: string;

    @Column({ nullable: true })
    githubUrl: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column('text', { array: true, default: [] })
    screenshots: string[];

    @Column({ type: 'jsonb', default: {} })
    features: Record<number, any>;
}
