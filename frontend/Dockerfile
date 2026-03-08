ARG NODE_VERSION=22-alpine

# ------------------------------
# Base
# ------------------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app

# Avoid common issues of Alpine Docker images
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY frontend/package.json ./frontend/package.json

# ------------------------------
# Dependencies
# ------------------------------
FROM base AS deps
WORKDIR /usr/src/app
RUN npm ci --workspace=frontend

# ------------------------------
# Development runner
# ------------------------------
FROM deps AS development
WORKDIR /usr/src/app
COPY frontend ./frontend

# Ensure .next is owned by node
RUN mkdir -p frontend/.next && chown -R node:node frontend/.next

USER node
CMD ["npm", "run", "dev", "--workspace=frontend"]

# ------------------------------
# Build
# ------------------------------
FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build --workspace=frontend

# ------------------------------
# Production runner
# ------------------------------
FROM node:${NODE_VERSION} AS production
WORKDIR /usr/src/app

COPY package*.json ./
COPY frontend/package.json ./frontend/package.json

RUN npm ci --workspace=frontend --omit=dev

COPY --from=build /usr/src/app/frontend/public ./frontend/public
COPY --from=build /usr/src/app/frontend/.next/standalone ./frontend
COPY --from=build /usr/src/app/frontend/.next/static ./frontend/.next/static

USER node
CMD ["node", "frontend/server.js"]
