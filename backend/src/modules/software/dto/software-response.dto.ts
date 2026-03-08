import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    BooleanCriterionDto,
    NumericCriterionDto,
} from '../../criteria/dto/criterion-response.dto';

export class SoftwareListItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    logoUrl: string | null;

    @ApiProperty()
    shortDescription: string;

    @ApiProperty()
    usageCount: number;

    @ApiProperty({ type: [String] })
    categories: string[];
}

export class SoftwareBooleanCriterionDto extends BooleanCriterionDto {
    @ApiProperty()
    value: number;
}

export class SoftwareNumericCriterionDto extends NumericCriterionDto {
    @ApiProperty()
    value: number;
}

export class SoftwareDetailDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    developer: string;

    @ApiProperty()
    shortDescription: string;

    @ApiPropertyOptional()
    fullDescription: string | null;

    @ApiPropertyOptional()
    websiteUrl: string | null;

    @ApiPropertyOptional()
    gitRepoUrl: string | null;

    @ApiPropertyOptional()
    logoUrl: string | null;

    @ApiProperty({ type: [String] })
    screenshotUrls: string[];

    @ApiProperty()
    usageCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => Array })
    categories: { id: number; slug: string; name: string }[];

    @ApiProperty({ type: [SoftwareBooleanCriterionDto] })
    booleanCriteria: SoftwareBooleanCriterionDto[];

    @ApiProperty({ type: [SoftwareNumericCriterionDto] })
    numericCriteria: SoftwareNumericCriterionDto[];
}

export class SoftwareQueryDto {
    @ApiPropertyOptional({ description: 'Search by name or shortDescription' })
    q?: string;

    @ApiPropertyOptional({ example: 1, default: 1 })
    page?: number;

    @ApiPropertyOptional({ example: 10, default: 10 })
    perPage?: number;
}
