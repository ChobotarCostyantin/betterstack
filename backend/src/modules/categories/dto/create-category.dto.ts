import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'ides', description: 'Unique slug for URL' })
    slug: string;

    @ApiProperty({ example: 'IDEs & Code Editors' })
    name: string;

    @ApiPropertyOptional({
        type: [Number],
        description: 'IDs of boolean criteria',
    })
    booleanCriteriaIds?: number[];

    @ApiPropertyOptional({
        type: [Number],
        description: 'IDs of numeric criteria',
    })
    numericCriteriaIds?: number[];
}
