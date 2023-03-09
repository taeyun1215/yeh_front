FROM node:alpine
RUN pwd

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN pwd

COPY --from=0 /usr/src/app/out /usr/share/nginx/html
RUN find /usr/src/app/out -type d

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]



# FROM node:14-alpine as build-stage

# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=build-stage /app/out /usr/share/nginx/html
# COPY ./default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3000
