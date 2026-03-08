import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMetricDto {
    @ApiPropertyOptional({ example: 'Startup time (ms)' })
    name?: string;

    @ApiPropertyOptional({ example: false })
    higherIsBetter?: boolean;
}
