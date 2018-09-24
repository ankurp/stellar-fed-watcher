const accountHandler = require('./account');
const paymentHandler = require('./payment');
const stellarStream = require('./stellar-stream');

stellarStream((msg) => {
  switch (msg.type) {
    case 'payment': return paymentHandler(msg);
    case 'create_account': return accountHandler(msg);
    default: return false;
  }
});

module.exports = () => 'Stellar Watcher Up and Watching';
