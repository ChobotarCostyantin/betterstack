import { ApiProperty } from '@nestjs/swagger';

export class IsUsedResponseDto {
    @ApiProperty({ example: true })
    isUsed: boolean;
}
