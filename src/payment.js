const mailer = require('./mailer');
const client = require('./cache');
const fetch = require('./fetch');

const paymentHandler = (msg) => {
  const {
    _links: {
      transaction: {
        href: transactionUrl
      }
    },
    to: account,
    amount,
    from,
    asset_code: assetCode = 'XLM'
  } = msg;
  console.log(`PAYMENTS: ${account} received payment of ${amount} ${assetCode}`);
  client.smembers(account, (err, emails) => {
    if (err) {
      console.error('Error fetching from cache');
      return;
    }
    fetch(transactionUrl).then(({ memo, memo_type: memoType }) => {
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

          For more details view here: ${transactionUrl}

          To stop receiving these email please update the settings in your account on stellarfed.org`
        });
      });
    });
  });
};

module.exports = paymentHandler;
