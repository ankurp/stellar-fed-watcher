require('now-env');
const StellarSdk = require('stellar-sdk');
const mailer = require('./mailer');
const client = require('./cache');

const server = new StellarSdk.Server('https://horizon.stellar.org');
const closeStream = server.payments()
  .cursor('now')
  .stream({
    onmessage: (msg) => {
      if (msg.type !== 'payment') return;

      const { to } = msg;
      client.smembers(to, (err, emails) => {
        if (err) {
          console.error('Error fetching from cache');
          return;
        }
        emails.forEach((email) => mailer.send({
          to: email,
          text: `You have received ${msg.amount} Stellar lumen(s) from ${msg.from}
          \nFor more details view here: https://horizon.stellar.org/transactions/${msg.transaction_hash}
          \nTo stop receiving these email please update the settings in your account on stellarfed.org`
        }));
      });
    }
  });

process.on('SIGINT', () => {
  closeStream();
  client.quit();
});

module.exports = () => 'StellarFed Account Watcher is Up and Watching';

