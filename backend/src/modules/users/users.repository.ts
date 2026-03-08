import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { SoftwareUsage } from 'src/modules/users/entities/software-usage.entity';
import { Role } from 'src/common/enums/role.enum';
import { adminConfig } from 'src/config/admin.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly ormRepo: Repository<User>,
        @InjectRepository(SoftwareUsage)
        private readonly usageRepo: Repository<SoftwareUsage>,
        @Inject(adminConfig.KEY)
        private readonly admin: ConfigType<typeof adminConfig>,
    ) {}

    async onModuleInit() {
        const count = await this.ormRepo.count();
        if (count === 0) {
            console.log('[Users] Database is empty. Seeding default admin...');
            const passwordHash = await bcrypt.hash(this.admin.password, 10);
            await this.ormRepo.save({
                email: this.admin.email,
                passwordHash,
                role: Role.ADMIN,
            });
        }
    }

    findByEmail(email: string) {
        return this.ormRepo.findOneBy({ email });
    }

    findById(id: number) {
        return this.ormRepo.findOneBy({ id });
    }

    create(data: Partial<User>) {
        return this.ormRepo.save(data);
    }

    updateRole(id: number, role: Role) {
        return this.ormRepo.update(id, { role });
    }

    findUsage(userId: number, softwareId: number) {
        return this.usageRepo.findOneBy({ userId, softwareId });
    }

    markSoftwareAsUsed(userId: number, softwareId: number) {
        return this.usageRepo.save({ userId, softwareId });
    }

    markSoftwareAsUnused(userId: number, softwareId: number) {
        return this.usageRepo.delete({ userId, softwareId });
    }
}
