# pull official base image
FROM node:14.15.3

# set working directory
WORKDIR /server

# install server dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . ./

EXPOSE 3000

# serve
CMD node src/index.js