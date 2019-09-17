const sgMail = require('@sendgrid/mail');
const mailOptions = { from: 'info@stellarfed.org' };

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.sendMail = function(opts) {
  sgMail.send(Object.assign(mailOptions, opts));
};

module.exports = sgMail;
