import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSoftwareDto {
    @ApiProperty({ example: [1, 2], description: 'Array of Category IDs' })
    categoryIds: number[];

    @ApiProperty({ example: 'JetBrains Rider' })
    name: string;

    @ApiPropertyOptional({ example: 'JetBrains' })
    developer?: string;

    @ApiPropertyOptional({ example: 'Fast & powerful cross-platform .NET IDE' })
    shortDescription: string;

    @ApiPropertyOptional({
        example: '## Overview\nRider is an excellent choice for...',
        description: 'Markdown description',
    })
    fullDescription?: string;

    @ApiPropertyOptional({ example: 'https://jetbrains.com/rider' })
    websiteUrl?: string;

    @ApiPropertyOptional({ example: 'https://github.com/JetBrains/...' })
    githubUrl?: string;

    @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
    logoUrl?: string;

    @ApiPropertyOptional({ example: ['img1.png', 'img2.png'] })
    screenshots?: string[];

    @ApiPropertyOptional({ example: ['feature1', 'feature2'] })
    features: string[];

    @ApiProperty({ example: { '1': true, '2': 3.2 } })
    criteria: Record<number, any>;
}
