import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { Role } from '@common/enums/role.enum';
import type { User } from '../entities/user.entity';

export class UserDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@test.com' })
    email: string;

    @ApiProperty({ enum: Role, example: Role.USER })
    role: Role;

    @ApiPropertyOptional()
    fullName?: string | null;

    @ApiPropertyOptional()
    bio?: string | null;

    @ApiPropertyOptional()
    avatarUrl?: string | null;

    @ApiPropertyOptional()
    websiteUrl?: string | null;

    static from(user: User): UserDto {
        const dto = new UserDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.role = user.role;
        dto.fullName = user.fullName;
        dto.bio = user.bio;
        dto.avatarUrl = user.avatarUrl;
        dto.websiteUrl = user.websiteUrl;
        return dto;
    }
}

export class UpdateUserRoleDto {
    @ApiProperty({ enum: Role, example: Role.AUTHOR })
    @IsEnum(Role)
    role: Role;
}

export class UpdateUserProfileDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    fullName?: string | null;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bio?: string | null;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatarUrl?: string | null;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    websiteUrl?: string | null;
}

export class AuthorDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    bio: string;

    @ApiPropertyOptional()
    avatarUrl: string | null;

    @ApiPropertyOptional()
    websiteUrl: string | null;
}
