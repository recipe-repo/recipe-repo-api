FROM node:10-alpine

ARG PORT=3664
ENV PORT ${PORT}
ENV DATABASE_HOST 'mongodb://localhost'
ENV DATABASE_NAME recipes
ENV DATABASE_USER ""
ENV DATABASE_PW ""
ENV IMAGE_DIR 'public/images'

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

RUN apk add --update python3 git && python3 -m pip install git+git://github.com/hhursev/recipe-scrapers.git

EXPOSE ${PORT}
CMD node app.js