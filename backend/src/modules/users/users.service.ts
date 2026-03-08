import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    ConflictException,
    OnModuleInit,
    Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Role } from '@common/enums/role.enum';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { User } from './entities/user.entity';
import { SoftwareUsage } from './entities/software-usage.entity';
import { AuthDto } from './dto/auth.dto';
import { adminConfig } from '@config/admin.config';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(SoftwareUsage)
        private readonly usageRepo: Repository<SoftwareUsage>,
        @Inject(adminConfig.KEY)
        private readonly admin: ConfigType<typeof adminConfig>,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async onModuleInit() {
        const count = await this.userRepo.count();
        if (count === 0) {
            console.log('[Users] Database is empty. Seeding default admin...');
            const passwordHash = await bcrypt.hash(this.admin.password, 10);
            await this.userRepo.save({
                email: this.admin.email,
                passwordHash,
                role: Role.ADMIN,
            });
        }
    }

    async register(dto: AuthDto) {
        if (await this.userRepo.findOneBy({ email: dto.email })) {
            throw new BadRequestException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepo.save({
            email: dto.email,
            passwordHash,
        });
        return this.generateToken(user);
    }

    async login(dto: AuthDto) {
        const user = await this.userRepo.findOneBy({ email: dto.email });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(user);
    }

    async makeAdmin(id: number) {
        await this.userRepo.update(id, { role: Role.ADMIN });
        return { success: true };
    }

    async markSoftwareAsUsed(userId: number, softwareId: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.usageRepo.findOneBy({ userId, softwareId });
        if (existing) throw new ConflictException('Already marked as used');

        await this.usageRepo.save({ userId, softwareId });

        this.eventEmitter.emit(
            SoftwareMarkedUsedEvent.eventName,
            new SoftwareMarkedUsedEvent(userId, softwareId),
        );

        return { success: true };
    }

    async markSoftwareAsUnused(userId: number, softwareId: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.usageRepo.findOneBy({ userId, softwareId });
        if (!existing) throw new NotFoundException('Usage record not found');

        await this.usageRepo.delete({ userId, softwareId });

        this.eventEmitter.emit(
            SoftwareMarkedUnusedEvent.eventName,
            new SoftwareMarkedUnusedEvent(userId, softwareId),
        );

        return { success: true };
    }

    private generateToken(user: User) {
        return {
            access_token: this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            }),
        };
    }
}
