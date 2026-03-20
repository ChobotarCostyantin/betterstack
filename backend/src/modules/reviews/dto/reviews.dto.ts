import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AuthorDetailsDto {
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

export class SoftwareReviewResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: AuthorDetailsDto })
    author: AuthorDetailsDto;
}

export class CreateSoftwareReviewDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    softwareSlug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class UpdateSoftwareReviewDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    content?: string;
}

export class CreateSoftwareComparisonReviewDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    softwareSlugA: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    softwareSlugB: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class UpdateSoftwareComparisonReviewDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    content?: string;
}

export class UpdateAuthorDetailsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsString()
    bio: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatarUrl: string | null;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    websiteUrl: string | null;
}

export class AuthorDetailsWithUserDto extends AuthorDetailsDto {
    @ApiProperty()
    userEmail: string;

    @ApiProperty()
    userRole: string;
}
