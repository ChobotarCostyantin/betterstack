import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface ParseIdsPipeOptions {
    /**
     * When true, an absent or empty value throws a BadRequestException.
     * When false (default), an absent value returns undefined.
     */
    required?: boolean;
}

/**
 * Parses a comma-separated string of integer IDs from a query parameter.
 *
 * - `undefined` / empty string:
 *   - `required: true`  → throws BadRequestException
 *   - `required: false` → returns undefined
 * - Non-integer tokens are rejected with BadRequestException.
 *
 * Usage (required):
 *   @Query('categoryIds', new ParseIdsPipe({ required: true })) ids: number[]
 *
 * Usage (optional):
 *   @Query('categoryIds', new ParseIdsPipe()) ids?: number[]
 */
@Injectable()
export class ParseIdsPipe implements PipeTransform<
    string,
    number[] | undefined
> {
    constructor(private readonly options: ParseIdsPipeOptions = {}) {}

    transform(value: string | undefined): number[] | undefined {
        if (value === undefined || value === '') {
            if (this.options.required) {
                throw new BadRequestException(
                    'Query parameter must be a non-empty comma-separated list of integers',
                );
            }
            return undefined;
        }

        const tokens = value.split(',');
        const ids: number[] = [];

        for (const token of tokens) {
            const trimmed = token.trim();
            if (trimmed === '') continue;

            const n = Number(trimmed);
            if (!Number.isInteger(n) || n <= 0) {
                throw new BadRequestException(
                    `Invalid ID "${trimmed}": each value must be a positive integer`,
                );
            }
            ids.push(n);
        }

        if (ids.length === 0) {
            if (this.options.required) {
                throw new BadRequestException(
                    'Query parameter must be a non-empty comma-separated list of integers',
                );
            }
            return undefined;
        }

        return ids;
    }
}
