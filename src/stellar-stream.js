const StellarSdk = require('stellar-sdk');
const client = require('./cache');
const StellarDomain = require('./domain');
const server = new StellarSdk.Server(StellarDomain);

const stellarStream = (onmessage) => {
  const closeStream = server.payments()
    .cursor('now')
    .stream({ onmessage });

  process.on('SIGINT', () => {
    closeStream();
    client.quit();
  });
};

module.exports = stellarStream;
