import { ApiProperty } from '@nestjs/swagger';

export class BooleanCriterionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ description: 'true when value != 0' })
    isPositive: boolean;
}

export class NumericCriterionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    higherIsBetter: boolean;
}
