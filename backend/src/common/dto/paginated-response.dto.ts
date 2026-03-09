import { ApiProperty } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

export class PaginationMeta {
    @ApiProperty({ example: 100 })
    total: number;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    perPage: number;

    @ApiProperty({ example: 10 })
    totalPages: number;
}

export class PaginatedResponseDto<T> {
    data: T[];

    @ApiProperty({ type: () => PaginationMeta })
    meta: PaginationMeta;

    constructor(data: T[], total: number, page: number, perPage: number) {
        this.data = data;
        this.meta = {
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }
}

/**
 * Creates a concrete subclass of PaginatedResponseDto<T> with a typed `data`
 * array, so that @nestjs/swagger can reflect the correct schema at build time.
 *
 * Usage:
 *   @ApiOkResponse({ type: PaginatedOf(UserDto) })
 */
export function PaginatedOf<T>(ItemDto: Type<T>) {
    class PaginatedDtoClass extends PaginatedResponseDto<T> {
        @ApiProperty({ type: [ItemDto] })
        declare data: T[];
    }
    // Give the class a unique name so the Swagger plugin registers distinct
    // schemas (e.g. "PaginatedUserDto") instead of all colliding on "PaginatedDtoClass".
    Object.defineProperty(PaginatedDtoClass, 'name', {
        value: `Paginated${ItemDto.name}`,
    });
    return PaginatedDtoClass;
}
