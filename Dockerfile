FROM node:alpine as builder

WORKDIR /home/ec2-user/yeh_front/
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 3000
COPY /home/ec2-user/yeh_front/default.conf /etc/nginx/conf.d/default.conf

COPY /home/ec2-user/yeh_front/out /usr/share/nginx/html

# COPY --from=0 /usr/src/app/.next /usr/share/nginx/html

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
