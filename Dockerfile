FROM node:10.10.0-slim

RUN apt-get update 
RUN apt-get install -y build-essential python
RUN npm install -g yarn@1.9.4

WORKDIR /srv/stellar-fed-watcher

ADD package.json yarn.lock ./

RUN yarn

ADD index.js account.js cache.js mailer.js payment.js ./

CMD ["npm", "start"]
