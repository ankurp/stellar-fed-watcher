require('now-env');
const StellarSdk = require('stellar-sdk');
const mailer = require('./mailer');
const client = require('./cache');
const START_INDEX = 0;
const LAST_INDEX = -1;

const server = new StellarSdk.Server('https://horizon.stellar.org');
const closeStream = server.payments()
  .cursor('now')
  .stream({
    onmessage: (msg) => {
      if (msg.type !== 'payment') return;

      const { to } = msg;
      client.lrange(to, START_INDEX, LAST_INDEX, (err, emails) => {
        if (err) {
          console.error('Error fetching from cache');
          return;
        }
        emails.forEach((email) => mailer.send({
          to: email,
          text: `You received ${msg.amount} Stellar lumens from ${msg.from}
          \nFor more details view here: https://horizon.stellar.org/transactions/${msg.transaction_hash}`
        }));
      });
    }
  });

process.on('SIGINT', () => {
  closeStream();
  client.quit();
});

module.exports = () => 'StellarFed Account Watcher is Up and Watching';

