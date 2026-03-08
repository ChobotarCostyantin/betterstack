import { ApiProperty } from '@nestjs/swagger';

export class FactorDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    positiveVariant: string;

    @ApiProperty()
    negativeVariant: string;
}
