const accountHandler = require('./account');
const paymentHandler = require('./payment');
const stellarStream = require('./stellar-stream');
let transactionsProcessed = 0;

stellarStream((msg) => {
  transactionsProcessed += 1;
  switch (msg.type) {
    case 'payment': return paymentHandler(msg);
    case 'create_account': return accountHandler(msg);
    default: return false;
  }
});

const numOfTransactionsProcessed = () => transactionsProcessed;

module.exports = numOfTransactionsProcessed;
