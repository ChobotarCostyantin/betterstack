import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsArray,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class RenameCategoryDto {
    @ApiPropertyOptional({ example: 'ides' })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiPropertyOptional({ example: 'IDEs & Code Editors' })
    @IsString()
    @IsOptional()
    name?: string;
}

export class UpdateCategoryCriteriaDto {
    @ApiProperty({ type: [Number], description: 'IDs of factors' })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    factorIds: number[];

    @ApiProperty({ type: [Number], description: 'IDs of metrics' })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    metricIds: number[];
}

/** @deprecated kept for compatibility during transition */
export class UpdateCategoryDto extends RenameCategoryDto {}
