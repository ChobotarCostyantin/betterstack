import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsNumber,
    IsUrl,
} from 'class-validator';

export class CreateSoftwareDto {
    @ApiProperty({
        example: 'jetbrains-rider',
        description: 'Unique slug for URL',
    })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'JetBrains Rider' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'JetBrains' })
    @IsString()
    @IsOptional()
    developer?: string;

    @ApiProperty({ example: 'Fast & powerful cross-platform .NET IDE' })
    @IsString()
    @IsNotEmpty()
    shortDescription: string;

    @ApiPropertyOptional({
        example: '## Overview\nRider is an excellent choice for...',
        description: 'Markdown description',
    })
    @IsString()
    @IsOptional()
    fullDescription?: string;

    @ApiPropertyOptional({ example: 'https://jetbrains.com/rider' })
    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @ApiPropertyOptional({ example: 'https://github.com/JetBrains/rider' })
    @IsUrl()
    @IsOptional()
    gitRepoUrl?: string;

    @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;

    @ApiPropertyOptional({
        example: [
            'https://example.com/img1.png',
            'https://example.com/img2.png',
        ],
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    screenshotUrls?: string[];

    @ApiPropertyOptional({
        example: [1, 2, 3],
        description: 'List of category IDs to associate with this software',
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    categoryIds?: number[];
}
