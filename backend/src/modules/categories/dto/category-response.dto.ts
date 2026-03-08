import { ApiProperty } from '@nestjs/swagger';
import {
    BooleanCriterionDto,
    NumericCriterionDto,
} from '../../criteria/dto/criterion-response.dto';

export class CategoryListItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;
}

export class CategoryDetailDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: [BooleanCriterionDto] })
    booleanCriteria: BooleanCriterionDto[];

    @ApiProperty({ type: [NumericCriterionDto] })
    numericCriteria: NumericCriterionDto[];
}

export class UniqueCriteriaDto {
    @ApiProperty({ type: [BooleanCriterionDto] })
    booleanCriteria: BooleanCriterionDto[];

    @ApiProperty({ type: [NumericCriterionDto] })
    numericCriteria: NumericCriterionDto[];
}
