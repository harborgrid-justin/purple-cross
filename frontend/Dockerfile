# =============================================================================
# Build Stage
# =============================================================================
FROM node:18-alpine AS builder

# Set build arguments for optimization
ARG NODE_ENV=production
ARG VITE_API_BASE_URL

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies with optimizations
RUN npm ci --prefer-offline --no-audit && \
    npm cache clean --force

# Copy source code
COPY . .

# Build application with production optimizations
RUN npm run build

# Verify build output
RUN ls -la /app/dist && \
    test -f /app/dist/index.html || (echo "Build failed: index.html not found" && exit 1)

# =============================================================================
# Production Stage with Nginx
# =============================================================================
FROM nginx:1.25-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Create non-root user for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx

# Use non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# Development Stage
# =============================================================================
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --prefer-offline

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
