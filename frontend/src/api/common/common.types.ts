export type PaginatedMeta = {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
};

export type Paginated<T> = {
    data: T[];
    meta: PaginatedMeta;
};

export type PaginationQuery = {
    page?: number;
    perPage?: number;
};
