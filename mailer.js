const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mailer = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}));

const mailOptions = {
  from: 'ankur@stellarfed.org',
  subject: 'Stellar payment received notification'
};

mailer.send = function(opts) {
  mailer.sendMail(Object.assign(mailOptions, opts), function(error, info) {
    if (error) {
      console.error(`Error sending email ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = mailer;
