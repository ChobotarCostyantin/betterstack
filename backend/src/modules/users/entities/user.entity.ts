import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import type { SoftwareUsage } from './software-usage.entity';
import { Software } from '@modules/software/entities/software.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    githubUrl: string;

    @Column({ nullable: true })
    linkedinUrl: string;

    @Column({ type: 'varchar', default: Role.USER })
    role: Role;

    @OneToMany('SoftwareUsage', 'user')
    softwareUsages: SoftwareUsage[];

    @OneToMany('Software', 'author')
    authoredSoftware: Software[];
}
