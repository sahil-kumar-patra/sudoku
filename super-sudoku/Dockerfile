# Stage 1: Build the Node.js application
FROM node:10.16.3-slim as build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

ADD . /app/

RUN npm run build

# Stage 2: Serve the built application using Nginx
FROM nginx:1.25.3-alpine-slim

# Introduce a known vulnerable package
RUN apk add --no-cache curl=7.67.0-r0

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
