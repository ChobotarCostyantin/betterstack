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
RUN npm ci --workspace=frontend

# ------------------------------
# Build
# ------------------------------
FROM deps AS build
COPY . .
RUN npm run build -w frontend

# ------------------------------
# Development runner
# ------------------------------
FROM deps AS development
COPY frontend ./frontend

# Ensure .next is owned by node before dropping privileges
RUN mkdir -p frontend/.next && chown -R node:node frontend/.next

USER node
CMD ["npm", "run", "dev", "-w", "frontend"]

# ------------------------------
# Production runner
# ------------------------------
FROM base AS production
ENV NODE_ENV=production

COPY --from=build /usr/src/app/frontend/.next/standalone .
COPY --from=build /usr/src/app/frontend/.next/static ./frontend/.next/static
COPY --from=build /usr/src/app/frontend/public ./frontend/public

USER node
CMD ["node", "frontend/server.js"]
