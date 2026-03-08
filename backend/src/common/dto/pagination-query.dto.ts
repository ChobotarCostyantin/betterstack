import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    page?: number;

    @ApiPropertyOptional({ example: 10, default: 10 })
    perPage?: number;
}
