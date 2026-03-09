import { ApiProperty } from '@nestjs/swagger';
import { FactorDto } from '../../criteria/dto/factor-response.dto';
import { MetricDto } from '../../criteria/dto/metric-response.dto';

export class CategoryListItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;
}

export class CategoryDetailDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: [FactorDto] })
    factors: FactorDto[];

    @ApiProperty({ type: [MetricDto] })
    metrics: MetricDto[];
}
