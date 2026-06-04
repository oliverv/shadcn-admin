# Multi-stage build for OpenMemory Infrastructure Dashboard
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all source code first
COPY . .

# Install dependencies (ignore build script warnings in Docker)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the application
ARG VITE_AUTHENTIK_TOKEN
ENV VITE_AUTHENTIK_TOKEN=$VITE_AUTHENTIK_TOKEN
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3001
EXPOSE 3001

# Health check using the dedicated /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
