import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMetricDto {
    @ApiPropertyOptional({ example: 'Startup time (ms)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    higherIsBetter?: boolean;
}
