const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

client.on('error', (err) => console.error('Cache client error', err));

module.exports = client;
