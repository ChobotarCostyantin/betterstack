'use server';

import { ShortSoftware, Category } from './types';

const SOFTWARE_DB: ShortSoftware[] = [
    {
        id: 1,
        name: 'Next.js',
        slug: 'nextdotjs',
        shortDescription: 'The React Framework for the Web',
        categoryIds: [1],
        logoUrl: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg',
    },
    {
        id: 2,
        name: 'Nest.js',
        slug: 'nestdotjs',
        shortDescription: 'A progressive Node.js framework',
        categoryIds: [1],
        logoUrl: 'https://www.vectorlogo.zone/logos/nestjs/nestjs-icon.svg',
    },
    {
        id: 3,
        name: 'Tailwind CSS',
        slug: 'tailwindcss',
        shortDescription: 'Utility-first CSS framework',
        categoryIds: [3],
        logoUrl: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
    },
    {
        id: 4,
        name: 'PostgreSQL',
        slug: 'postgresql',
        shortDescription: 'Advanced open source relational database',
        categoryIds: [2, 1, 3, 4],
        logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg',
    },
    {
        id: 5,
        name: 'TypeScript TEXT TEXT',
        slug: 'typescript',
        shortDescription:
            'Statically typed, interpreted, and compiled high-level language',
        categoryIds: [4],
        logoUrl: 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg',
    },
    {
        id: 6,
        name: 'Express.js',
        slug: 'expressdotjs',
        shortDescription:
            'Fast, unopinionated, minimalist web framework for Node.js',
        categoryIds: [1],
    },
    {
        id: 7,
        name: 'React',
        slug: 'react',
        shortDescription: 'JavaScript library for building user interfaces',
        categoryIds: [1],
    },
    {
        id: 8,
        name: 'Node.js',
        slug: 'nodedotjs',
        shortDescription:
            "JavaScript runtime built on Chrome's V8 JavaScript engine",
        categoryIds: [1],
    },
];

const CATEGORY_DB: Category[] = [
    { id: 1, name: 'Frameworks TEXT TEXT TEXT', slug: 'frameworks' },
    { id: 2, name: 'Databases', slug: 'databases' },
    { id: 3, name: 'CSS Tools', slug: 'css-tools' },
    { id: 4, name: 'Languages', slug: 'languages' },
];

export async function searchAction(query: string): Promise<ShortSoftware[]> {
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

export async function getFeaturedAction(): Promise<ShortSoftware[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const randomIndex = Math.floor(Math.random() * SOFTWARE_DB.length);
    const startIndex = Math.max(0, randomIndex - 2);
    const endIndex = Math.min(SOFTWARE_DB.length, startIndex + 3);

    return SOFTWARE_DB.slice(startIndex, endIndex);
}
export async function getSoftwareByIdAction(id: number): Promise<ShortSoftware> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return SOFTWARE_DB.find((item) => item.id === id) || SOFTWARE_DB[0];
}

export async function getCategoryByIdAction(id: number): Promise<Category> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return CATEGORY_DB.find((item) => item.id === id) || CATEGORY_DB[0];
}