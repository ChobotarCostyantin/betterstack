import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsNumber,
} from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'ides', description: 'Unique slug for URL' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'IDEs & Code Editors' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        type: [Number],
        description: 'IDs of factors to associate',
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    factorIds?: number[];

    @ApiPropertyOptional({
        type: [Number],
        description: 'IDs of metrics to associate',
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    metricIds?: number[];
}
