FROM node:12.10.0-slim

RUN apt-get update 
RUN apt-get install -y build-essential python
RUN npm install -g yarn@1.9.4

WORKDIR /srv/stellar-fed-watcher

COPY package.json yarn.lock ./

RUN yarn

COPY src/ ./src

CMD ["npm", "start"]
