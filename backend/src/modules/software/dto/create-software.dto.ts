import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsNumber,
    IsUrl,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScreenshotItemDto {
    @ApiProperty({ example: 'https://example.com/img1.png' })
    @IsUrl()
    url: string;

    @ApiPropertyOptional({ example: 'Main dashboard view' })
    @IsString()
    @IsOptional()
    alt?: string;
}

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

    @ApiPropertyOptional({ type: [ScreenshotItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScreenshotItemDto)
    @IsOptional()
    screenshots?: ScreenshotItemDto[];

    @ApiPropertyOptional({
        example: [1, 2, 3],
        description: 'List of category IDs to associate with this software',
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    categoryIds?: number[];
}
