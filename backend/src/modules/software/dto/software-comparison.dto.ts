import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SoftwareFactorsDto } from './software-response.dto';

export class SoftwareComparisonSideDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    developer: string;

    @ApiProperty()
    shortDescription: string;

    @ApiPropertyOptional()
    websiteUrl: string | null;

    @ApiPropertyOptional()
    gitRepoUrl: string | null;

    @ApiPropertyOptional()
    logoUrl: string | null;

    @ApiProperty({ type: [String] })
    screenshotUrls: string[];

    @ApiProperty()
    usageCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => Array })
    categories: { id: number; slug: string; name: string }[];

    @ApiProperty({ type: () => SoftwareFactorsDto })
    factors: SoftwareFactorsDto;
}

export class MetricComparisonItemDto {
    @ApiProperty()
    metricId: number;

    @ApiProperty()
    metricName: string;

    @ApiProperty()
    higherIsBetter: boolean;

    @ApiPropertyOptional({ nullable: true })
    aValue: number | null;

    @ApiPropertyOptional({ nullable: true })
    bValue: number | null;

    @ApiProperty({ enum: ['a', 'b'], nullable: true })
    winner: 'a' | 'b' | null;
}

export class SoftwareComparisonDto {
    @ApiProperty({ type: () => SoftwareComparisonSideDto })
    softwareA: SoftwareComparisonSideDto;

    @ApiProperty({ type: () => SoftwareComparisonSideDto })
    softwareB: SoftwareComparisonSideDto;

    @ApiProperty({ type: [MetricComparisonItemDto] })
    metricsComparison: MetricComparisonItemDto[];

    @ApiPropertyOptional({ nullable: true, type: String })
    comparisonNote: string | null;
}
