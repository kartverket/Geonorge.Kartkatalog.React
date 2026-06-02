const prerender = require('prerender');

function parseBoolean(value) {
  return typeof value === 'string' && ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function parseInteger(value, fallbackValue) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function parseChromeFlags(value) {
  return (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function send(res, statusCode, message, headers = {}) {
  Object.entries(headers).forEach(([headerName, headerValue]) => {
    res.setHeader(headerName, headerValue);
  });

  res.send(statusCode, message);
}

const extraChromeFlags = parseChromeFlags(process.env.EXTRA_CHROME_FLAGS);

const server = prerender({
  chromeLocation: process.env.CHROME_BIN || null,
  captureConsoleLog: parseBoolean(process.env.CAPTURE_CONSOLE_LOG),
  extraChromeFlags,
  followRedirects: parseBoolean(process.env.FOLLOW_REDIRECTS),
  logRequests: parseBoolean(process.env.LOG_REQUESTS),
  pageDoneCheckInterval: parseInteger(process.env.PAGE_DONE_CHECK_INTERVAL, 500),
  pageLoadTimeout: parseInteger(process.env.PAGE_LOAD_TIMEOUT, 20000),
  waitAfterLastRequest: parseInteger(process.env.WAIT_AFTER_LAST_REQUEST, 500)
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

const CHROME_DEBUG_PORT = 9222;

function checkChromeAlive() {
  return new Promise((resolve) => {
    const req = require('http').get(
      `http://127.0.0.1:${CHROME_DEBUG_PORT}/json/version`,
      { timeout: 3000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(res.statusCode === 200));
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

server.use({
  requestReceived(req, res, next) {
    const url = req.url || '';

    if (url === '/health/live') {
      return send(res, 200, 'ok', {
        'Content-Type': 'text/plain; charset=UTF-8'
      });
    }

    if (url === '/health/ready') {
      return checkChromeAlive().then((alive) => {
        if (alive) {
          send(res, 200, 'ok', { 'Content-Type': 'text/plain; charset=UTF-8' });
        } else {
          send(res, 503, 'chrome not ready', { 'Content-Type': 'text/plain; charset=UTF-8' });
        }
      });
    }

    // Legacy endpoint
    if (url === '/health') {
      return send(res, 200, 'ok', {
        'Content-Type': 'text/plain; charset=UTF-8'
      });
    }

    return next();
  }
});

console.log('Starting prerender service', {
  chromeBin: process.env.CHROME_BIN || null,
  extraChromeFlags,
  port: process.env.PORT || 3000
});

server.start();
