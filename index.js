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
          client.get(to, function(err, email) {
            if (err) {
              console.error(`Error with get request for ${to}`);
              return;
            }
            if (!email) return;

            mailer.send({
              to: email,
              text: `You received ${msg.amount} Stellar lumens from ${msg.from}
              \nFor more details view here: https://horizon.stellar.org/transactions/${msg.transaction_hash}`
            });
          });
        }
      });

process.on('SIGINT', () => {
  closeStream();
  client.quit();
});

module.exports = () => 'Stellar Fed Watcher Up and Running';

