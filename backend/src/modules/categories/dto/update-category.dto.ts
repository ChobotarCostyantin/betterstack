import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RenameCategoryDto {
    @ApiPropertyOptional({ example: 'ides' })
    slug?: string;

    @ApiPropertyOptional({ example: 'IDEs & Code Editors' })
    name?: string;
}

export class UpdateCategoryCriteriaDto {
    @ApiProperty({ type: [Number], description: 'IDs of boolean criteria' })
    booleanCriteriaIds: number[];

    @ApiProperty({ type: [Number], description: 'IDs of numeric criteria' })
    numericCriteriaIds: number[];
}

/** @deprecated kept for compatibility during transition */
export class UpdateCategoryDto extends RenameCategoryDto {}
