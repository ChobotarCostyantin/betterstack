import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFactorDto {
    @ApiPropertyOptional({ example: 'Open source' })
    positiveVariant?: string;

    @ApiPropertyOptional({ example: 'Proprietary' })
    negativeVariant?: string;
}
