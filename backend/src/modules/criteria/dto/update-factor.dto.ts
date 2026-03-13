import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateFactorDto {
    @ApiPropertyOptional({ example: 'Open source' })
    @IsString()
    @IsOptional()
    positiveVariant?: string;

    @ApiPropertyOptional({ example: 'Proprietary' })
    @IsString()
    @IsOptional()
    negativeVariant?: string;
}
