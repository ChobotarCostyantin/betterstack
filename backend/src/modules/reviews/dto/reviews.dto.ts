import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { AuthorDto } from '../../users/dto/user.dto';

export class SoftwareReviewResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: AuthorDto })
    author: AuthorDto;
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
