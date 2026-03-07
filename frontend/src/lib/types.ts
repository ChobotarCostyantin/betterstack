export interface Software {
    id: number;
    name: string;
    slug: string;
    categoryIds: number[];
    shortDescription: string;
    logoUrl?: string;
    developer?: string;
    fullDescription?: string;
    websiteUrl?: string;
    githubUrl?: string;
    screenshots?: string[];
    features: Record<number, any>;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
}
