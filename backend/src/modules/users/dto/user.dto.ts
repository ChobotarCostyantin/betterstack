import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import type { User } from '../entities/user.entity';

export class UserDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@test.com' })
    email: string;

    @ApiProperty({ example: 'John Doe', nullable: true })
    fullName: string | null;

    @ApiProperty({ example: 'Senior DevOps Engineer...', nullable: true })
    bio: string | null;

    @ApiProperty({ example: 'https://github.com/johndoe', nullable: true })
    githubUrl: string | null;

    @ApiProperty({ example: 'https://linkedin.com/in/johndoe', nullable: true })
    linkedinUrl: string | null;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ enum: Role, example: Role.USER })
    role: Role;

    static from(user: User): UserDto {
        const dto = new UserDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.fullName = user.fullName || null;
        dto.bio = user.bio || null;
        dto.githubUrl = user.githubUrl || null;
        dto.linkedinUrl = user.linkedinUrl || null;
        dto.avatarUrl = user.avatarUrl || null;
        dto.role = user.role;
        return dto;
    }
}
