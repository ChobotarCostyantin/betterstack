import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
    @ApiProperty({
        example: 'Startup time (ms)',
        description: 'Display name of the metric',
    })
    name: string;

    @ApiProperty({
        example: false,
        description: 'Whether higher values are better',
    })
    higherIsBetter: boolean;
}
