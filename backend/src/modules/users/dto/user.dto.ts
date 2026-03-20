import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import type { User } from '../entities/user.entity';

export class UserDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@test.com' })
    email: string;

    @ApiProperty({ enum: Role, example: Role.USER })
    role: Role;

    static from(user: User): UserDto {
        const dto = new UserDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.role = user.role;
        return dto;
    }
}
