# =============================================================================
# Stage 1: Builder
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# =============================================================================
# Stage 2: Production
# =============================================================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Generate Prisma Client in production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy scripts
COPY scripts ./scripts

# Create upload directories
RUN mkdir -p uploads/avatars uploads/knowledge uploads/books

# Expose application port
EXPOSE 2530

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:2530/api/v1 || exit 1

# Start the application
CMD ["node", "dist/main"]
