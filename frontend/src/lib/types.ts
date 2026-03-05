export interface ShortSoftware {
    id: number;
    name: string;
    slug: string;
    categoryIds: number[];
    shortDescription: string;
    logoUrl?: string;
}

export interface FullSoftware extends ShortSoftware {
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
