FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

ARG VITE_BACKEND_URL

RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
