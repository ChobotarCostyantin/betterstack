ARG NODE_VERSION=22-alpine

# ------------------------------
# Base
# ------------------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app

# Avoid common issues of Alpine Docker images
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY backend/package.json ./backend/package.json

# ------------------------------
# Dependencies
# ------------------------------
FROM base AS deps
WORKDIR /usr/src/app
RUN npm ci --workspace=backend

# ------------------------------
# Development runner
# ------------------------------
FROM deps AS development
WORKDIR /usr/src/app
COPY backend ./backend
USER node
CMD ["npm", "run", "start:dev", "--workspace=backend"]

# ------------------------------
# Build
# ------------------------------
FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build --workspace=backend

# ------------------------------
# Production runner
# ------------------------------
FROM node:${NODE_VERSION} AS production
WORKDIR /usr/src/app

# Required for native add-ons (e.g. bcrypt) on Alpine
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package.json ./backend/package.json

RUN npm ci --workspace=backend --omit=dev

COPY --from=build /usr/src/app/backend/dist ./backend/dist

USER node
CMD ["node", "backend/dist/main.js"]
