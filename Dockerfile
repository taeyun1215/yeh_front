FROM node:alpine as builder

COPY package*.json ./

COPY . .

FROM nginx:alpine
EXPOSE 3000

RUN pwd

COPY default.conf /etc/nginx/conf.d/default.conf

RUN pwd
COPY --from=builder ./out /usr/share/nginx/html