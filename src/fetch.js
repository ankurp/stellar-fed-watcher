const https = require('https');

const fetch = (url) => new Promise((resolve, reject) => {
  https.get(url, (resp) => {
    const data = [];
    resp.on('data', (chunk) => data.push(chunk));
    resp.on('end', () => resolve(JSON.parse(data.join(''))));
  }).on('error', reject);
});

module.exports = fetch;
