FROM node:18

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

FROM nginx:alpine
COPY dist /usr/share/nginx/html