FROM node:14-alpine as build-stage

WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /usr/app/.next /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


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
