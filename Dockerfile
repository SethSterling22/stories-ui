# Build stage
FROM node:20-alpine AS build

WORKDIR /app


# Declare arguments for build
ARG VITE_TAPIS_API_BASE_URL
ARG VITE_CKAN_BASE_URL
ARG VITE_DYNAMO_API_BASE_URL
ARG VITE_DYNAMO_DASHBOARD_URL
ARG VITE_MAX_FILE_SIZE
ARG VITE_N8N_WEBHOOK_URL


# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
