const mailer = require('./mailer');
const client = require('./cache');

const getPaymentHandler = (domain) => (msg) => {
  const { to } = msg;
  client.smembers(to, (err, emails) => {
    if (err) {
      console.error('Error fetching from cache');
      return;
    }
    emails.forEach((email) => mailer.send({
      to: email,
      subject: 'You received payment via Stellar',
      text: `You just received ${msg.amount} Stellar lumen(s) from ${msg.from}
      \nFor more details view here: ${domain}/transactions/${msg.transaction_hash}
      \nTo stop receiving these email please update the settings in your account on stellarfed.org`
    }));
  });
};

module.exports = getPaymentHandler;
