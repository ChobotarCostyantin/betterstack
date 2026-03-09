import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RenameCategoryDto {
    @ApiPropertyOptional({ example: 'ides' })
    slug?: string;

    @ApiPropertyOptional({ example: 'IDEs & Code Editors' })
    name?: string;
}

export class UpdateCategoryCriteriaDto {
    @ApiProperty({ type: [Number], description: 'IDs of factors' })
    factorIds: number[];

    @ApiProperty({ type: [Number], description: 'IDs of metrics' })
    metricIds: number[];
}

/** @deprecated kept for compatibility during transition */
export class UpdateCategoryDto extends RenameCategoryDto {}
