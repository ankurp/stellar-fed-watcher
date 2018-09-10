require('now-env');
const StellarSdk = require('stellar-sdk');
const client = require('./cache');
const accountHandler = require('./account');
const getPaymentHandler = require('./payment');

const StellarDomain = process.env.NODE_ENV === 'production' ?
  'https://horizon.stellar.org' :
  'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Server(StellarDomain);
const paymentHandler = getPaymentHandler(StellarDomain);
const closeStream = server.payments()
  .cursor('now')
  .stream({
    onmessage: (msg) => {
      switch (msg.type) {
        case 'payment': return paymentHandler(msg);
        case 'create_account': return accountHandler(msg);
        default: return false;
      }
    }
  });

process.on('SIGINT', () => {
  closeStream();
  client.quit();
});

module.exports = () => 'StellarFed Account Watcher is Up and Watching';

