const http = require('http');
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

  res.statusCode = statusCode;
  res.send(message);
}

const extraChromeFlags = parseChromeFlags(process.env.EXTRA_CHROME_FLAGS);
const maxRenderConcurrency = parseInteger(process.env.MAX_RENDER_CONCURRENCY, 1);

const server = prerender({
  chromeLocation: process.env.CHROME_BIN || null,
  captureConsoleLog: parseBoolean(process.env.CAPTURE_CONSOLE_LOG),
  extraChromeFlags,
  followRedirects: parseBoolean(process.env.FOLLOW_REDIRECTS),
  logRequests: parseBoolean(process.env.LOG_REQUESTS),
  pageDoneCheckInterval: parseInteger(process.env.PAGE_DONE_CHECK_INTERVAL, 250),
  pageLoadTimeout: parseInteger(process.env.PAGE_LOAD_TIMEOUT, 10000),
  waitAfterLastRequest: parseInteger(process.env.WAIT_AFTER_LAST_REQUEST, 1000)
});

const CHROME_DEBUG_PORT = 9222;

function checkChromeAlive(timeoutMs = 1500) {
  return new Promise((resolve) => {
    const req = http.get(
      `http://127.0.0.1:${CHROME_DEBUG_PORT}/json/version`,
      { timeout: timeoutMs },
      (res) => {
        res.resume();
        res.on('end', () => resolve(res.statusCode === 200));
      }
    );

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

let activeRenderRequests = 0;

server.use({
  requestReceived(req, res, next) {
    const url = req.url || '';

    if (url === '/health/live' || url === '/health') {
      return send(res, 200, 'ok', {
        'Content-Type': 'text/plain; charset=UTF-8'
      });
    }

    if (url === '/health/ready') {
      return checkChromeAlive().then((alive) => {
        if (!alive) {
          return send(res, 503, 'chrome not ready', {
            'Content-Type': 'text/plain; charset=UTF-8'
          });
        }

        if (activeRenderRequests >= maxRenderConcurrency) {
          return send(res, 503, 'render worker busy', {
            'Content-Type': 'text/plain; charset=UTF-8'
          });
        }

        return send(res, 200, 'ok', {
          'Content-Type': 'text/plain; charset=UTF-8'
        });
      });
    }

    if (activeRenderRequests >= maxRenderConcurrency) {
      return send(res, 429, 'too many concurrent render requests', {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Retry-After': '2'
      });
    }

    activeRenderRequests += 1;

    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        activeRenderRequests = Math.max(0, activeRenderRequests - 1);
      }
    };

    res.on('finish', release);
    res.on('close', release);
    res.on('error', release);

    return next();
  }
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

console.log('Starting prerender service', {
  chromeBin: process.env.CHROME_BIN || null,
  extraChromeFlags,
  maxRenderConcurrency,
  port: process.env.PORT || 3000
});

server.start();