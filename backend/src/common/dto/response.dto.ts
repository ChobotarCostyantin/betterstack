import { ApiProperty } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

/**
 * Wraps a DTO in the `{ data: T }` envelope that TransformInterceptor
 * adds to every non-paginated response.
 *
 * Usage:
 *   @ApiOkResponse({ type: DataOf(UserDto) })
 */
export function DataOf<T>(ItemDto: Type<T>) {
    class DataDtoClass {
        @ApiProperty({ type: () => ItemDto })
        data: T;
    }
    Object.defineProperty(DataDtoClass, 'name', {
        value: `Data${ItemDto.name}`,
    });
    return DataDtoClass;
}

/**
 * Wraps an array DTO in the `{ data: T[] }` envelope that TransformInterceptor
 * adds to every non-paginated array response.
 *
 * Usage:
 *   @ApiOkResponse({ type: DataArrayOf(UserDto) })
 */
export function DataArrayOf<T>(ItemDto: Type<T>) {
    class DataArrayDtoClass {
        @ApiProperty({ type: [ItemDto] })
        data: T[];
    }
    Object.defineProperty(DataArrayDtoClass, 'name', {
        value: `DataArray${ItemDto.name}`,
    });
    return DataArrayDtoClass;
}
