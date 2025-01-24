# Use a Node.js version with known vulnerabilities for testing
#FROM node:10.16.3-slim as build

FROM node:20.12.2-slim as build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

ADD . /app/

RUN npm run build

FROM nginx:1.25.3-alpine-slim
this is my docker file
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
