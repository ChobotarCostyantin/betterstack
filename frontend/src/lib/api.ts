'use server';

import { Software, Category } from './types';

const SOFTWARE_DB: Software[] = [
    {
        id: 1,
        name: 'Next.js',
        slug: 'nextjs',
        shortDescription: 'The React Framework for the Web',
        categoryIds: [1],
        logoUrl: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg',
        features: {},
    },
    {
        id: 2,
        name: 'Nest.js',
        slug: 'nestjs',
        shortDescription: 'A progressive Node.js framework',
        categoryIds: [1],
        logoUrl: 'https://www.vectorlogo.zone/logos/nestjs/nestjs-icon.svg',
        features: {},
    },
    {
        id: 3,
        name: 'Tailwind CSS',
        slug: 'tailwindcss',
        shortDescription: 'Utility-first CSS framework',
        categoryIds: [3],
        logoUrl: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
        features: {},
    },
    {
        id: 4,
        name: 'PostgreSQL',
        slug: 'postgresql',
        developer: 'Postgres',
        shortDescription: 'Advanced open source relational database',
        fullDescription: '## Overview\nPostgreSQL is a powerful, open source relational database management system (RDBMS).',
        categoryIds: [2, 1, 3, 4],
        logoUrl: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg',
        websiteUrl: 'https://www.postgresql.org/',
        githubUrl: 'https://github.com/postgres/postgres',
        screenshots: ['https://www.vectorlogo.zone/logos/dotnet/dotnet-official.svg', 'https://www.vectorlogo.zone/logos/dotnet/dotnet-official.svg', 'https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21~bgwhite.svg', 'https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21~bgwhite.svg', 'https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21~bgwhite.svg'],
        features: { 1: true, 2: 3.2, 3: 'test', 4: 'bradar fak u bradar nex comen ok' },
    },
    {
        id: 5,
        name: 'TypeScript TEXT TEXT',
        slug: 'typescript',
        shortDescription:
            'Statically typed, interpreted, and compiled high-level language',
        categoryIds: [4],
        logoUrl: 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg',
        features: {},
    },
    {
        id: 6,
        name: 'Express.js',
        slug: 'expressjs',
        shortDescription:
            'Fast, unopinionated, minimalist web framework for Node.js',
        categoryIds: [1],
        features: {},
    },
    {
        id: 7,
        name: 'React',
        slug: 'react',
        shortDescription: 'JavaScript library for building user interfaces',
        categoryIds: [1],
        features: {},
    },
    {
        id: 8,
        name: 'Node.js',
        slug: 'nodejs',
        shortDescription:
            "JavaScript runtime built on Chrome's V8 JavaScript engine",
        categoryIds: [1],
        features: {},
    },
];

const CATEGORY_DB: Category[] = [
    { id: 1, name: 'Frameworks', slug: 'frameworks' },
    { id: 2, name: 'Databases', slug: 'databases' },
    { id: 3, name: 'CSS Tools', slug: 'css-tools' },
    { id: 4, name: 'Languages', slug: 'languages' },
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
export async function getSoftwareBySlugAction(slug: string): Promise<Software> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return SOFTWARE_DB.find((item) => item.slug === slug) || SOFTWARE_DB[0];
}
export async function getCategoryByIdAction(id: number): Promise<Category> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return CATEGORY_DB.find((item) => item.id === id) || CATEGORY_DB[0];
}