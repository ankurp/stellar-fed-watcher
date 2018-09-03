const bcrypt = require('bcrypt');
const client = require('./cache');
const mailer = require('./mailer');

const accountHandler = (msg) => {
  const { account, funder, starting_balance: startingBalance } = msg;
  client.hget(process.env.NEW_ACCOUNTS_CACHE_KEY, account, (err, email) => {
    if (err) {
      console.error('Error fetching from cache');
      return;
    }
    if (!email) {
      return;
    }
    bcrypt.hash(account, process.env.SALT)
      .then((token) => {
        mailer.send({
          to: email,
          subject: 'You received payment via Stellar',
          text: `You just received ${startingBalance} Stellar lumen(s) from ${funder}.
          \nClick on this link to get your Stellar Account details https://stellarfed.org/accounts/${account}?token=${encodeURIComponent(token)}`
        });
      });
  });
};

module.exports = accountHandler;
