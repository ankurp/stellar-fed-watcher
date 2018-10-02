const StellarSdk = require('stellar-sdk');
const client = require('./cache');
const StellarDomain = require('./domain');
const server = new StellarSdk.Server(StellarDomain);

const stellarStream = (onmessage) => {
  client.get('CURSOR', (err, cursor) => {
    if (err) {
      console.error('Error fetching last processed cursor', err);
      return;
    }

    const closeStream = server.payments()
      .cursor(cursor || 'now')
      .stream({ onmessage });

    process.on('SIGINT', () => {
      closeStream();
      client.quit();
    });
  });
};

module.exports = stellarStream;
