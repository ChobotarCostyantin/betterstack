import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateMetricDto {
    @ApiProperty({
        example: 'Startup time (ms)',
        description: 'Display name of the metric',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: false,
        description: 'Whether higher values are better',
    })
    @IsBoolean()
    @IsNotEmpty()
    higherIsBetter: boolean;
}
