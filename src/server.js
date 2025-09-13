/* eslint-disable no-console */
const http = require('http');
const url = require('url');

const htmlHandler = require('./htmlResponses');
const mediaHandler = require('./mediaResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  const { pathname } = url.parse(req.url);
  console.log(`Request: ${pathname}`);

  switch (pathname) {
    // pages
    case '/':
    case '/index':
    case '/index.html':
      htmlHandler.getIndex(req, res);
      break;
    case '/page2':
      htmlHandler.getPage2(req, res);
      break;
    case '/page3':
      htmlHandler.getPage3(req, res);
      break;

    // media
    case '/party.mp4':
      mediaHandler.getParty(req, res);
      break;
    case '/bling.mp3':
      mediaHandler.getBling(req, res);
      break;
    case '/bird.mp4':
      mediaHandler.getBird(req, res);
      break;

    default:
      htmlHandler.getIndex(req, res);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
