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
* **Infrastructure:** Docker and Docker Compose for local development.

## Installation

### Prerequisites

* Docker and Docker Compose

### Quick Start

Start all services (frontend, backend, and database) with:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:3010
* **PostgreSQL:** localhost:5432

## Project Structure

* **/backend**: NestJS application containing logic for categories, criteria, software, and users.
* **/frontend**: Next.js application for the user interface.
* **docker-compose.yml**: Orchestrates frontend, backend, and PostgreSQL services.