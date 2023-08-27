FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4001

