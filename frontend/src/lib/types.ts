export interface Software {
    id: number;
    name: string;
    categoryIds: number[];
    shortDescription: string;
    logoUrl?: string;
    type: 'software';
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    type: 'category';
}
