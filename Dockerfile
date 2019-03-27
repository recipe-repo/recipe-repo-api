FROM node:10-alpine

ARG PORT=3664
ENV PORT ${PORT}
ENV DATABASE_HOST 'mongodb://localhost'
ENV DATABASE_NAME recipes
ENV DATABASE_USER ""
ENV DATABASE_PW ""

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

EXPOSE ${PORT}
CMD node app.js