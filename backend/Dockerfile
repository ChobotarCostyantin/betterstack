ARG NODE_VERSION=22-alpine

# ------------------------------
# Base
# ------------------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app

# Avoid common issues of Alpine Docker images
RUN apk add --no-cache libc6-compat

COPY package*.json ./

# ------------------------------
# Dependencies
# ------------------------------
FROM base AS deps
RUN npm ci

# ------------------------------
# Development runner
# ------------------------------
FROM deps AS development
WORKDIR /usr/src/app
COPY . .
USER node
CMD ["npm", "run", "start:dev"]

# ------------------------------
# Build
# ------------------------------
FROM deps AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build

# ------------------------------
# Production runner
# ------------------------------
FROM node:${NODE_VERSION} AS production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

USER node
CMD ["node", "dist/main.js"]
