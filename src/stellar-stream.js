const StellarSdk = require('stellar-sdk');
const client = require('./cache');
const StellarDomain = require('./domain');
const server = new StellarSdk.Server(StellarDomain);

const stellarStream = (onMessage) => {
  client.get('CURSOR', (err, savedCursor = 'now') => {
    let cursor = savedCursor;
    if (err) {
      console.error('Error fetching last processed cursor', err);
      return;
    }

    const closeStream = server.payments()
      .cursor(cursor)
      .stream({
        onmessage: (msg) => {
          onMessage(msg);
          cursor = msg.id;
        }
      });

    process.on('SIGINT', () => {
      if (cursor) {
        client.set('CURSOR', cursor);
      }
      closeStream();
      client.quit();
    });
  });
};

module.exports = stellarStream;
