const accountHandler = require('./account');
const paymentHandler = require('./payment');
const stellarStream = require('./stellar-stream');
const client = require('./cache');

stellarStream((msg) => {
  switch (msg.type) {
    case 'payment':         paymentHandler(msg); break;
    case 'create_account':  accountHandler(msg); break;
    default:
  }
  client.set('CURSOR', msg.id);
});

module.exports = () => 'Stellar Watcher Up and Watching';
