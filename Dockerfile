FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache make gcc g++ python3

COPY package*.json ./

RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . ./


EXPOSE 8000

CMD ["npm", "start"]