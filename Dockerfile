# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build:staging

# Build stage for backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build:staging

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

# Setup service
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Copy start script
COPY start.sh ./
RUN chmod +x ./start.sh

EXPOSE 3000
EXPOSE 80

# Set environment to staging
ENV NODE_ENV=staging

CMD ["./start.sh"] 