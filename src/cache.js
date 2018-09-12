const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

client.on('error', function (err) {
  console.error(`Error ${err}`);
});

module.exports = client;
