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

# Ensure .next is owned by node
RUN mkdir -p .next && chown -R node:node .next

USER node
CMD ["npm", "run", "dev"]

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

COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/.next/static ./.next/static

USER node
CMD ["node", "server.js"]
