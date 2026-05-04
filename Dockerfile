FROM node:22

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server.js"]