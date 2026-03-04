# betterstack
[![Node.js](https://img.shields.io/badge/Node.js-0d121c?style=flat-square&logo=nodedotjs&logoColor=5FA04E&link=https%3A%2F%2Fnodejs.org%2Fen)](https://nodejs.org/en)
[![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&link=https%3A%2F%2Fwww.npmjs.com%2F)](https://www.npmjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white&link=https%3A%2F%2Fwww.docker.com%2F)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white&link=https%3A%2F%2Fwww.postgresql.org%2F)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=nextdotjs&labelColor=black&color=ededed)](https://nextjs.org/)
[![Nest.js](https://img.shields.io/badge/Nest.js-11.1.15-E0234E?style=flat-square&logo=nestjs&logoColor=white&labelColor=090909&link=https%3A%2F%2Fnestjs.com%2F)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat-square&logo=typeorm&logoColor=white&link=https%3A%2F%2Ftypeorm.io%2F)](https://typeorm.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-white?style=flat-square&logo=tailwindcss&logoColor=06B6D4&link=https%3A%2F%2Ftailwindcss.com%2F)](https://tailwindcss.com/)
[![Last commit](https://img.shields.io/github/last-commit/TeseySTD/betterstack?style=flat-square)](https://github.com/TeseySTD/betterstack/commits/main/)

## Overview

**betterstack** is a software comparison platform designed for developers. The application provides a structured way to evaluate and compare different software tools based on defined criteria and categories. It features a robust backend for managing data and a modern frontend for a seamless user experience.

## Tech Stack

* **Frontend:** Next.js 16.1.6, Tailwind CSS.
* **Backend:** NestJS 11, TypeORM, PostgreSQL.
* **Infrastructure:** Docker and Docker Compose for database management.

## Installation

### Prerequisites

* Node.js (v20 or higher recommended)
* Docker and Docker Compose
* npm

### 1. Database Setup

The project uses PostgreSQL managed via Docker. Start the database container using:

```bash
docker-compose up -d

```

This will initialize a database named `betterstack_db` on port `5432`.

### 2. Backend Installation

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

```

Start the backend in development mode:

```bash
npm run start:dev

```

The backend includes Swagger documentation for API exploration.

### 3. Frontend Installation

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install

```

Start the frontend development server:

```bash
npm run dev

```

The application will be available at `http://localhost:3000` (or the port specified by Next.js).

## Project Structure

* **/backend**: NestJS application containing logic for categories, criteria, software, and users.
* **/frontend**: Next.js application for the user interface.
* **docker-compose.yml**: Orchestrates the PostgreSQL database service.