import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

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
}
