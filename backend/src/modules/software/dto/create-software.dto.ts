import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSoftwareDto {
    @ApiProperty({
        example: 'jetbrains-rider',
        description: 'Unique slug for URL',
    })
    slug: string;

    @ApiProperty({ example: 'JetBrains Rider' })
    name: string;

    @ApiPropertyOptional({ example: 'JetBrains' })
    developer?: string;

    @ApiProperty({ example: 'Fast & powerful cross-platform .NET IDE' })
    shortDescription: string;

    @ApiPropertyOptional({
        example: '## Overview\nRider is an excellent choice for...',
        description: 'Markdown description',
    })
    fullDescription?: string;

    @ApiPropertyOptional({ example: 'https://jetbrains.com/rider' })
    websiteUrl?: string;

    @ApiPropertyOptional({ example: 'https://github.com/JetBrains/rider' })
    gitRepoUrl?: string;

    @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
    logoUrl?: string;

    @ApiPropertyOptional({
        example: [
            'https://example.com/img1.png',
            'https://example.com/img2.png',
        ],
    })
    screenshotUrls?: string[];
}
