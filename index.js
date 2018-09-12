const numOfTransactionsProcessed = require('./src/watcher');

module.exports = () => `<html>
  <head><meta charset="UTF-8" /></head>
  <style>
    body { background: #333; text-align: center; }
    main {
      max-width: 320px;
      margin: 20px auto 0;
      border-radius: 2px;
      background: #fff;
      padding: 5px 20px;
    }
  </style>
  <body>
    <main>
      <h1>StellarFed Watcher Up and Watching 👀</h1>
      <p>${numOfTransactionsProcessed()} payment transactions processed</p>
    </main>
  </body>
</html>`;
