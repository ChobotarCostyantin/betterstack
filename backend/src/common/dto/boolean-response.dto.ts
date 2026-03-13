import { ApiProperty } from '@nestjs/swagger';

export class BooleanResponseDto {
    @ApiProperty()
    data: boolean;
}
