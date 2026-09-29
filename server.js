const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const oneday = 24 * 60 * 60 * 1000

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();
// Increase the maximum number of listeners
require('events').EventEmitter.defaultMaxListeners = 25;


app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    setTimeout(() => {
      
    },oneday );
    if (err) throw err;
    console.log('> Ready on http://localhost:',process.env.PORT);
  });
});
