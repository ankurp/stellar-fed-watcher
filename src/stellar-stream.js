const EventSource = require('eventsource');
const client = require('./cache');
const StellarDomain = require('./domain');

const stellarStream = (onMessage) => {
  const es = new EventSource(`${StellarDomain}/payments?cursor=now`);
  es.onmessage = (rawMessage) => {
    try {
      if (rawMessage.type !== 'message') return;
      onMessage(JSON.parse(rawMessage.data));
    } catch (err) {
      console.error(err);
    }
  };

  process.on('SIGINT', () => {
    es.close();
    client.quit();
  });
};

module.exports = stellarStream;
