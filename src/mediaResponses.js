const fs = require('fs');
const path = require('path');

const tryResolve = (relParts) => {
  const p = path.resolve(__dirname, ...relParts);
  return fs.existsSync(p) ? p : null;
};

const resolveMediaPath = (filename) => {
  const candidates = [
    ['..', 'client', filename],
    ['..', 'client', 'media', filename],
    ['..', filename],
  ];
  for (const c of candidates) {
    const hit = tryResolve(c);
    if (hit) return hit;
  }
  return null;
};

const streamMedia = (req, res, absolutePath, contentType) => {
  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? '404 Not Found' : `500 Internal Server Error\n${err.message}`);
      return;
    }

    const total = stats.size;
    let { range } = req.headers;
    if (!range) range = 'bytes=0-';

    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!m) {
      res.writeHead(416, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('416 Range Not Satisfiable');
      return;
    }

    let start = m[1] ? parseInt(m[1], 10) : 0;
    let end = m[2] ? parseInt(m[2], 10) : total - 1;
    if (Number.isNaN(start) || start < 0) start = 0;
    if (Number.isNaN(end) || end >= total) end = total - 1;
    if (start > end) start = Math.max(0, end - 1);

    const chunkSize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    });

    fs.createReadStream(absolutePath, { start, end }).pipe(res);
  });
};

const getParty = (req, res) => {
  const file = resolveMediaPath('party.mp4');
  if (!file) { res.writeHead(404).end('party.mp4 not found'); return; }
  streamMedia(req, res, file, 'video/mp4');
};

const getBling = (req, res) => {
  const file = resolveMediaPath('bling.mp3');
  if (!file) { res.writeHead(404).end('bling.mp3 not found'); return; }
  streamMedia(req, res, file, 'audio/mpeg');
};

const getBird = (req, res) => {
  const file = resolveMediaPath('bird.mp4');
  if (!file) { res.writeHead(404).end('bird.mp4 not found'); return; }
  streamMedia(req, res, file, 'video/mp4');
};

module.exports = { getParty, getBling, getBird, streamMedia };

