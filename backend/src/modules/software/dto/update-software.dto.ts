import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSoftwareDto } from './create-software.dto';

export class UpdateSoftwareDto extends PartialType(CreateSoftwareDto) {}

export class SoftwareFactorItemDto {
    @ApiProperty({ description: 'Factor ID' })
    @IsNumber()
    factorId: number;

    @ApiProperty({
        description:
            'Whether this factor is a pro (true) or con (false) for this software',
    })
    @IsBoolean()
    isPositive: boolean;
}

export class UpdateSoftwareFactorsDto {
    @ApiProperty({ type: [SoftwareFactorItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SoftwareFactorItemDto)
    factors: SoftwareFactorItemDto[];
}

export class SoftwareMetricItemDto {
    @ApiProperty({ description: 'Metric ID' })
    @IsNumber()
    metricId: number;

    @ApiProperty({ description: 'Measured value for this software' })
    @IsNumber()
    value: number;
}

export class UpdateSoftwareMetricsDto {
    @ApiProperty({ type: [SoftwareMetricItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SoftwareMetricItemDto)
    metrics: SoftwareMetricItemDto[];
}
