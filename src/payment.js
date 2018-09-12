const mailer = require('./mailer');
const client = require('./cache');
const StellarDomain = require('./domain');

const paymentHandler = (msg) => {
  const {
    to: account,
    amount,
    from,
    asset_code: assetCode,
    transaction_hash: transactionHash
  } = msg;
  console.log(`PAYMENTS: ${account} received payment of ${amount} ${assetCode}`);
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
        text: `You just received ${amount} ${assetCode} from ${from}
        \nFor more details view here: ${StellarDomain}/transactions/${transactionHash}
        \nTo stop receiving these email please update the settings in your account on stellarfed.org`
      });
    });
  });
};

module.exports = paymentHandler;
