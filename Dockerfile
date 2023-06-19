FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

# EXPOSE 5000

# RUN npm start

CMD ["npm", "start"]