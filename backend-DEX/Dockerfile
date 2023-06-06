FROM node:18.12.1 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


