const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..', 'client');

const safeRead = (p, fallback) => {
  try { return fs.readFileSync(p); }
  catch { return Buffer.from(fallback); }
};

const indexHTML = safeRead(
  path.join(clientDir, 'client.html'),
  '<!doctype html><h1>Missing client/client.html</h1>',
);

const page2HTML = safeRead(
  path.join(clientDir, 'client2.html'),
  '<!doctype html><h1>Missing client/client2.html</h1>',
);

const page3HTML = safeRead(
  path.join(clientDir, 'client3.html'),
  '<!doctype html><h1>Create client3.html for /page3</h1>',
);

const sendHTML = (res, buffer) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(buffer);
};

const getIndex = (req, res) => sendHTML(res, indexHTML);
const getPage2 = (req, res) => sendHTML(res, page2HTML);
const getPage3 = (req, res) => sendHTML(res, page3HTML);

module.exports = { getIndex, getPage2, getPage3 };

