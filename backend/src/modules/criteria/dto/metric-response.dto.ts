import { ApiProperty } from '@nestjs/swagger';

export class MetricDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    higherIsBetter: boolean;
}
