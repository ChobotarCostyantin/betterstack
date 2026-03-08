export class PaginationMeta {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export class PaginatedResponseDto<T> {
    data: T[];
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
