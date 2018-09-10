const EventSource = require('eventsource');
const client = require('./cache');
const accountHandler = require('./account');
const getPaymentHandler = require('./payment');

const StellarDomain = process.env.NODE_ENV === 'production' ?
  'https://horizon.stellar.org' :
  'https://horizon-testnet.stellar.org';
const paymentHandler = getPaymentHandler(StellarDomain);
const es = new EventSource(`${StellarDomain}/payments?cursor=now`);
es.onmessage = (rawMessage) => {
  try {
    if (rawMessage.type !== 'message') return false;

    const msg = JSON.parse(rawMessage.data);
    switch (msg.type) {
      case 'payment': return paymentHandler(msg);
      case 'create_account': return accountHandler(msg);
      default: return false;
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};

process.on('SIGINT', () => {
  es.close();
  client.quit();
});

module.exports = () => 'StellarFed Account Watcher is Up and Watching';

