import { ApiProperty } from '@nestjs/swagger';

export class CreateFactorDto {
    @ApiProperty({
        example: 'Open source',
        description: 'Positive variant display name',
    })
    positiveVariant: string;

    @ApiProperty({
        example: 'Proprietary',
        description: 'Negative variant display name',
    })
    negativeVariant: string;
}
