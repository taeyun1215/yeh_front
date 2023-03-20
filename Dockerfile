# Use an official Node.js runtime as a parent image
FROM node:14-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app
RUN npm run build

CMD [ "npm" , "run" , "start"]

# Create a new image with only the production assets
FROM nginx
EXPOSE 3000

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build app/out  /usr/share/nginx/html

# FROM node:alpine as builder

# COPY package*.json ./

# COPY . .

# FROM nginx:alpine
# EXPOSE 3000

# RUN pwd

# COPY default.conf /etc/nginx/conf.d/default.conf

# RUN pwd
# COPY --from=builder ./out /usr/share/nginx/html 