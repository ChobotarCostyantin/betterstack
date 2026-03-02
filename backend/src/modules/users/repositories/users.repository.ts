import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly ormRepo: Repository<User>,
    ) { }

    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Users] Database is empty. Seeding default admin...');
            const passwordHash = await bcrypt.hash('admin123', 10); //TODO: move to env
            await this.ormRepo.save({
                email: 'admin@admin.com',
                passwordHash,
                role: Role.ADMIN,
            });
        }
    }

    findByEmail(email: string) { return this.ormRepo.findOneBy({ email }); }
    findById(id: number) { return this.ormRepo.findOneBy({ id }); }
    create(data: Partial<User>) { return this.ormRepo.save(data); }
    updateRole(id: number, role: Role) { return this.ormRepo.update(id, { role }); }
}