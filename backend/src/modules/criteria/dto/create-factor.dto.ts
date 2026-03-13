import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFactorDto {
    @ApiProperty({
        example: 'Open source',
        description: 'Positive variant display name',
    })
    @IsString()
    @IsNotEmpty()
    positiveVariant: string;

    @ApiProperty({
        example: 'Proprietary',
        description: 'Negative variant display name',
    })
    @IsString()
    @IsNotEmpty()
    negativeVariant: string;
}
