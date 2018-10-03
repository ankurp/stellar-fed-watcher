const accountHandler = require('./account');
const paymentHandler = require('./payment');
const stellarStream = require('./stellar-stream');

stellarStream((msg) => {
  switch (msg.type) {
    case 'payment':         paymentHandler(msg); break;
    case 'create_account':  accountHandler(msg); break;
    default:
  }
});

module.exports = () => 'Stellar Watcher Up and Watching';
