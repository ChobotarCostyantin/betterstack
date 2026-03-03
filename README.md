# betterstack

## Overview

**betterstack** is a software comparison platform designed for developers. The application provides a structured way to evaluate and compare different software tools based on defined criteria and categories. It features a robust backend for managing data and a modern frontend for a seamless user experience.

## Tech Stack

* **Frontend:** Next.js 16.1.6, React 19, Tailwind CSS.
* **Backend:** NestJS 11, TypeORM, PostgreSQL.
* **Infrastructure:** Docker and Docker Compose for database management.

## Installation

### Prerequisites

* Node.js (v20 or higher recommended)
* Docker and Docker Compose
* npm or yarn

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