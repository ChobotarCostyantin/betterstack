import { ApiProperty } from '@nestjs/swagger';
import { CriterionType } from '../entities/criterion.entity';

export class CreateCriterionDto {
    @ApiProperty({
        example: 'Price (USD)',
        description: 'Display name of the criterion',
    })
    name: string;

    @ApiProperty({
        enum: CriterionType,
        example: CriterionType.NUMERIC,
        description: 'Data type of the criterion',
    })
    type: CriterionType;

    @ApiProperty({
        example: 100,
        description: 'Numeric value for this criterion',
    })
    value: number;

    @ApiProperty({
        example: false,
        description: 'Whether a higher value is considered better',
    })
    higherIsBetter: boolean;
}
