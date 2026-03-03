'use server';

import { Software, Category } from './types';

// export type SearchResult = Software | Category;

const SOFTWARE_DB: Software[] = [
    {
        id: 1,
        name: 'Next.js',
        shortDescription: 'The React Framework for the Web',
        type: 'software',
        categoryIds: [1],
    },
    {
        id: 2,
        name: 'NestJS',
        shortDescription: 'A progressive Node.js framework',
        type: 'software',
        categoryIds: [1],
    },
    {
        id: 3,
        name: 'Tailwind CSS',
        shortDescription: 'Utility-first CSS framework',
        type: 'software',
        categoryIds: [3],
    },
    {
        id: 4,
        name: 'PostgreSQL',
        shortDescription: 'Advanced open source relational database',
        type: 'software',
        categoryIds: [2],
    },
    {
        id: 5,
        name: 'TypeScript',
        shortDescription:
            'Statically typed, interpreted, and compiled high-level language',
        type: 'software',
        categoryIds: [4],
    },
    {
        id: 6,
        name: 'Express.js',
        shortDescription:
            'Fast, unopinionated, minimalist web framework for Node.js',
        type: 'software',
        categoryIds: [1],
    },
    {
        id: 7,
        name: 'React',
        shortDescription: 'JavaScript library for building user interfaces',
        type: 'software',
        categoryIds: [1],
    },
    {
        id: 8,
        name: 'Node.js',
        shortDescription:
            "JavaScript runtime built on Chrome's V8 JavaScript engine",
        type: 'software',
        categoryIds: [1],
    },
];

const CATEGORY_DB: Category[] = [
    { id: 1, name: 'Frameworks', slug: 'frameworks', type: 'category' },
    { id: 2, name: 'Databases', slug: 'databases', type: 'category' },
    { id: 3, name: 'CSS Tools', slug: 'css-tools', type: 'category' },
    { id: 4, name: 'Languages', slug: 'languages', type: 'category' },
];

export async function searchAction(query: string): Promise<Software[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase();

    const softwareResults = SOFTWARE_DB.filter(
        (item) =>
            item.name.toLowerCase().includes(q) ||
            item.shortDescription.toLowerCase().includes(q),
    );

    return [...softwareResults];
}

export async function getFeaturedAction(): Promise<Software[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const randomIndex = Math.floor(Math.random() * SOFTWARE_DB.length);
    const startIndex = Math.max(0, randomIndex - 2);
    const endIndex = Math.min(SOFTWARE_DB.length, startIndex + 3);

    return SOFTWARE_DB.slice(startIndex, endIndex);
}
export async function getSoftwareByIdAction(id: number): Promise<Software> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return SOFTWARE_DB.find((item) => item.id === id) || SOFTWARE_DB[0];
}
