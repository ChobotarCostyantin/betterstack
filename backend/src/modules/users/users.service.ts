import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/users.repository';
import { AuthDto } from './dto/auth.dto';
import { Role } from 'src/common/enums/role.enum';
import { User } from './entities/user.entity';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from 'src/common/events/software-usage.events';

@Injectable()
export class UsersService {
    constructor(
        private readonly repo: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async register(dto: AuthDto) {
        if (await this.repo.findByEmail(dto.email)) {
            throw new BadRequestException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repo.create({ email: dto.email, passwordHash });
        return this.generateToken(user);
    }

    async login(dto: AuthDto) {
        const user = await this.repo.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.generateToken(user);
    }

    async makeAdmin(id: number) {
        await this.repo.updateRole(id, Role.ADMIN);
        return { success: true };
    }

    async markAsUsed(userId: number, softwareId: number) {
        const user = await this.repo.findById(userId);
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.repo.findUsage(userId, softwareId);
        if (existing) throw new ConflictException('Already marked as used');

        await this.repo.markAsUsed(userId, softwareId);

        this.eventEmitter.emit(
            SoftwareMarkedUsedEvent.eventName,
            new SoftwareMarkedUsedEvent(userId, softwareId),
        );

        return { success: true };
    }

    async markAsUnused(userId: number, softwareId: number) {
        const user = await this.repo.findById(userId);
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.repo.findUsage(userId, softwareId);
        if (!existing) throw new NotFoundException('Usage record not found');

        await this.repo.markAsUnused(userId, softwareId);

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
