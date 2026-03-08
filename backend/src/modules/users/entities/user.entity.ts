import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import type { SoftwareUsage } from './software-usage.entity';

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

    @OneToMany('SoftwareUsage', 'user')
    softwareUsages: SoftwareUsage[];
}
