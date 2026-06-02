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
  
  res.send(statusCode, message);
}

function getRequestPath(req) {
  return (req.url || '').split('?')[0];
}

const extraChromeFlags = parseChromeFlags(process.env.EXTRA_CHROME_FLAGS);

const maxRenderConcurrency = parseInteger(process.env.MAX_RENDER_CONCURRENCY, 1);
const renderSlotTimeoutMs = parseInteger(process.env.RENDER_SLOT_TIMEOUT_MS, 70000);

const chromeDebugPort = parseInteger(process.env.CHROME_DEBUG_PORT, 9222);
const chromeHealthTimeoutMs = parseInteger(process.env.CHROME_HEALTH_TIMEOUT_MS, 1500);

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

function checkChromeAlive(timeoutMs = chromeHealthTimeoutMs) {
  return new Promise((resolve) => {
    const req = http.get(
      `http://127.0.0.1:${chromeDebugPort}/json/version`,
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

const activeRenderRequests = new Map();

function releaseRenderSlot(req, reason) {
  const reqId = req?.prerender?.reqId;

  if (!reqId) {
    return;
  }

  const entry = activeRenderRequests.get(reqId);

  if (!entry) {
    return;
  }

  clearTimeout(entry.timer);
  activeRenderRequests.delete(reqId);

  console.log('Released render slot', {
    reason,
    activeRenderRequests: activeRenderRequests.size,
    durationMs: Date.now() - entry.startedAt,
    url: entry.url
  });
}

server.use({
  requestReceived(req, res, next) {
    const path = getRequestPath(req);

    if (path === '/health/live' || path === '/health') {
      return send(res, 200, 'ok', {
        'Content-Type': 'text/plain; charset=UTF-8'
      });
    }

    if (path === '/health/ready') {
      return checkChromeAlive().then((alive) => {
        if (alive) {
          return send(res, 200, 'ok', {
            'Content-Type': 'text/plain; charset=UTF-8'
          });
        }

        return send(res, 503, 'chrome not ready', {
          'Content-Type': 'text/plain; charset=UTF-8'
        });
      });
    }

    if (activeRenderRequests.size >= maxRenderConcurrency) {
      return send(res, 429, 'too many concurrent render requests', {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Retry-After': '2'
      });
    }

    const reqId = req?.prerender?.reqId;

    if (!reqId) {
      console.warn('Render request missing req.prerender.reqId; continuing without concurrency tracking', {
        url: req?.url
      });

      return next();
    }

    const url = req?.prerender?.url || req?.url || '';

    const timer = setTimeout(() => {
      const staleEntry = activeRenderRequests.get(reqId);

      if (!staleEntry) {
        return;
      }

      activeRenderRequests.delete(reqId);

      console.warn('Force-released stale render slot', {
        activeRenderRequests: activeRenderRequests.size,
        durationMs: Date.now() - staleEntry.startedAt,
        url: staleEntry.url
      });
    }, renderSlotTimeoutMs);

    activeRenderRequests.set(reqId, {
      url,
      startedAt: Date.now(),
      timer
    });

    console.log('Acquired render slot', {
      activeRenderRequests: activeRenderRequests.size,
      maxRenderConcurrency,
      url
    });

    return next();
  },

  beforeSend(req, res, next) {
    releaseRenderSlot(req, 'beforeSend');
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
  renderSlotTimeoutMs,
  chromeDebugPort,
  chromeHealthTimeoutMs,
  port: process.env.PORT || 3000
});

server.start();