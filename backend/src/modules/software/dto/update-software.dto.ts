import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateSoftwareDto } from './create-software.dto';

export class UpdateSoftwareDto extends PartialType(CreateSoftwareDto) {}

export class SoftwareFactorItemDto {
    @ApiProperty({ description: 'Factor ID' })
    factorId: number;

    @ApiProperty({
        description:
            'Whether this factor is a pro (true) or con (false) for this software',
    })
    isPositive: boolean;
}

export class UpdateSoftwareFactorsDto {
    @ApiProperty({ type: [SoftwareFactorItemDto] })
    factors: SoftwareFactorItemDto[];
}

export class SoftwareMetricItemDto {
    @ApiProperty({ description: 'Metric ID' })
    metricId: number;

    @ApiProperty({ description: 'Measured value for this software' })
    value: number;
}

export class UpdateSoftwareMetricsDto {
    @ApiProperty({ type: [SoftwareMetricItemDto] })
    metrics: SoftwareMetricItemDto[];
}
