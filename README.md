<div align="center">
<img title="betterstack" src="./assets/logo.svg" alt="betterstack logo" width="128" height="128" />

# **betterstack**

[![Node.js](https://img.shields.io/badge/Node.js-0d121c?style=flat-square&logo=nodedotjs&logoColor=5FA04E&link=https%3A%2F%2Fnodejs.org%2Fen)](https://nodejs.org/en)
[![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&link=https%3A%2F%2Fwww.npmjs.com%2F)](https://www.npmjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white&link=https%3A%2F%2Fwww.docker.com%2F)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white&link=https%3A%2F%2Fwww.postgresql.org%2F)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=nextdotjs&labelColor=black&color=ededed)](https://nextjs.org/)
[![Nest.js](https://img.shields.io/badge/Nest.js-11.1.15-E0234E?style=flat-square&logo=nestjs&logoColor=white&labelColor=090909&link=https%3A%2F%2Fnestjs.com%2F)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat-square&logo=typeorm&logoColor=white&link=https%3A%2F%2Ftypeorm.io%2F)](https://typeorm.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-white?style=flat-square&logo=tailwindcss&logoColor=06B6D4&link=https%3A%2F%2Ftailwindcss.com%2F)](https://tailwindcss.com/)
[![Last commit](https://img.shields.io/github/last-commit/TeseySTD/betterstack?style=flat-square)](https://github.com/TeseySTD/betterstack/commits/main/)

</div>

## Overview

**betterstack** is a software comparison platform designed for developers. The application provides a structured way to evaluate and compare different software tools based on defined criteria and categories. It features a robust backend for managing data and a modern frontend for a seamless user experience.

## Tech Stack

- **Frontend:** Next.js 16.1.6, Tailwind CSS.
- **Backend:** NestJS 11, TypeORM, PostgreSQL.
- **Infrastructure:** Docker and Docker Compose for local development.

## Project Structure

```
betterstack/
├── backend/          # NestJS API — categories, criteria, software, users
├── frontend/         # Next.js UI
└── docker-compose.yml
```

## Development

### Prerequisites

- Node.js 22+ and npm 10+
- Docker and Docker Compose (required for the database)

### Option A — Everything in Docker (recommended for a clean start)

Starts the frontend, backend, and PostgreSQL in containers with hot reload via
volume mounts:

```bash
docker-compose up -d
```

| Service    | URL                   |
| ---------- | --------------------- |
| Frontend   | http://localhost:3000 |
| Backend    | http://localhost:3010 |
| PostgreSQL | localhost:5432        |

Stop all services:

```bash
docker-compose down
```

### Option B — DB in Docker, apps on the host

Useful when you want native Node.js performance and direct access to logs.

1. Start only PostgreSQL:

   ```bash
   npm run db:local:up
   ```

2. Install dependencies (once):

   ```bash
   npm install
   ```

3. Apply pending migrations:

   ```bash
   npm run db:migration:run
   ```

4. (Optional) Seed the database with sample data:

   ```bash
   npm run db:seed:dev
   ```

5. Start backend and frontend concurrently with hot reload:

   ```bash
   npm run dev
   ```

   Or start them separately:

   ```bash
   npm run be:dev   # NestJS on port 3010
   npm run fe:dev   # Next.js on port 3000
   ```

6. Stop PostgreSQL when done:

   ```bash
   npm run db:local:down
   ```

## Database Migrations

Migrations are plain JS files tracked in `backend/database/migrations/`.  
The TypeORM data-source is at `backend/database/data-source.js`.

> [!NOTE]
> Build the backend before generating a migration so the data-source reads
> up-to-date compiled entities:
>
> ```bash
> npm run build
> ```

| Command                                                  | Description                           |
| -------------------------------------------------------- | ------------------------------------- |
| `npm run db:migration:gen -- database/migrations/MyName` | Generate a migration from entity diff |
| `npm run db:migration:run`                               | Apply all pending migrations          |
| `npm run db:migration:rev`                               | Revert the last migration             |

## Dev Seeding

The `backend/database/dev-seed.js` script populates a **development** database
with a representative graph of sample data. It is **idempotent** — re-running
it skips any entity that already exists by its unique key.

```bash
npm run db:seed:dev
```

> [!NOTE]
> Requires the database to be running and all migrations applied first.

### What gets seeded

| Entity     | Records                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| Factors    | 5 (fast startup, low memory, good IntelliSense, rich plugins, free/OSS) |
| Metrics    | 4 (indexing time, memory footprint, GitHub stars, extensions count)     |
| Categories | 3 (IDEs & Editors, Database Clients, Programming Languages)             |
| Software   | 2 (JetBrains Rider, Visual Studio Code)                                 |

The _IDEs & Editors_ category is wired up with all factors and metrics. Both
software items are linked to that category with realistic factor and metric
values.
