import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/users.repository';
import { AuthDto } from './dto/auth.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        private readonly repo: UsersRepository,
        private readonly jwtService: JwtService,
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

    private generateToken(user: any) {
        return {
            access_token: this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            }),
        };
    }
}
