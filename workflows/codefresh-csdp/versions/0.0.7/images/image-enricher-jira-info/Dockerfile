FROM node:14.18.1-alpine

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "/app/src/index.js" ]
