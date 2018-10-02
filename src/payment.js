const mailer = require('./mailer');
const client = require('./cache');
const StellarDomain = require('./domain');

const paymentHandler = (msg) => {
  const {
    transaction,
    transaction_hash: transactionHash,
    to: account,
    amount,
    from,
    asset_code: assetCode = 'XLM'
  } = msg;
  console.log(`PAYMENTS: ${account} received payment of ${amount} ${assetCode}`);
  client.incr('TRANSACTIONS_PROCESSED');
  client.smembers(account, (err, emails) => {
    if (err) {
      console.error(`Error fetching email(s) for ${account}`, err);
      return;
    }

    transaction().then(({ memo, memo_type: memoType }) => {
      const senderInfo = [from];
      if (memoType === 'text' && memo) {
        senderInfo.push(`with memo "${memo}"`);
      }

      emails.forEach((email) => {
        console.log(`Sending payment notification email to ${email} for account ${account}`);
        mailer.send({
          to: email,
          subject: 'You received payment via Stellar',
          text: `You just received ${amount} ${assetCode} from ${senderInfo.join(' ')}
          \nFor more details view here: ${StellarDomain}/transactions/${transactionHash}
          \nTo stop receiving these email please update the settings in your account on stellarfed.org`
        });
      });
    });
  });
};

module.exports = paymentHandler;
