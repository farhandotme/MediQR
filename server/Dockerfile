FROM node:22-alpine

WORKDIR /app

COPY package*.json bun.lockb .env ./

RUN npm install --omit=dev

COPY ./dist .

EXPOSE 8000

CMD [ "node", "server.js" ]

