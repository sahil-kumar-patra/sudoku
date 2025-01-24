# Use a Node.js version with known vulnerabilities for testing
FROM node:10.16.3-slim as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json /app/

# Install dependencies (which will include the vulnerable package version)
RUN npm install

# Add the rest of the application files
ADD . /app/

# Run build script (assumes you are using a build tool like vite)
RUN npm run build

# Use NGINX to serve the built files
FROM nginx:1.25.3-alpine-slim

# Copy the build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port for NGINX
EXPOSE 80
