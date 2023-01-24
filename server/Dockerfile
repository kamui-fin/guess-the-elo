FROM node:16.18.1

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3080

CMD ["npm", "run", "start"]
