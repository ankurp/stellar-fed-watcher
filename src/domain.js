module.exports = process.env.NODE_ENV === 'production' ?
  'https://horizon.stellar.org' :
  'https://horizon-testnet.stellar.org';
