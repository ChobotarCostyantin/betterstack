ARG NODE_VERSION=22-alpine

# ------------------------------
# Base
# ------------------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app

# Required for native add-ons (e.g. bcrypt) on Alpine
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY backend/package.json ./backend/package.json

# ------------------------------
# Production dependencies
# ------------------------------
FROM base AS prod-deps
RUN npm ci --workspace=backend --omit=dev

# ------------------------------
# Development dependencies
# ------------------------------
FROM prod-deps AS dev-deps
RUN npm ci --workspace=backend

# ------------------------------
# Build
# ------------------------------
FROM dev-deps AS build
COPY . .
RUN npm run build -w backend

# ------------------------------
# Development runner
# ------------------------------
FROM dev-deps AS development
COPY backend ./backend
USER node
CMD ["npm", "run", "start:dev", "-w", "backend"]

# ------------------------------
# Production runner
# ------------------------------
FROM base AS production
ENV NODE_ENV=production

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/backend/database ./backend/database

USER node
CMD ["node", "backend/dist/main.js"]
