const mailer = require('./mailer');
const client = require('./cache');

const getPaymentHandler = (domain) => (msg) => {
  const {
    to: account,
    amount,
    from,
    transaction_hash: transactionHash
  } = msg;
  console.log(`PAYMENTS: ${account} received payment of ${amount}`);
  client.smembers(account, (err, emails) => {
    if (err) {
      console.error('Error fetching from cache');
      return;
    }
    emails.forEach((email) => {
      console.log(`Sending payment notification email to ${email} for account ${account}`);
      mailer.send({
        to: email,
        subject: 'You received payment via Stellar',
        text: `You just received ${amount} Stellar lumen(s) from ${from}
        \nFor more details view here: ${domain}/transactions/${transactionHash}
        \nTo stop receiving these email please update the settings in your account on stellarfed.org`
      });
    });
  });
};

module.exports = getPaymentHandler;
