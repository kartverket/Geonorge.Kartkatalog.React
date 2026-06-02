FROM node:24-bookworm-slim

ENV NODE_ENV=production \
    HOME=/tmp \
    PORT=3000 \
    CHROME_BIN=/usr/bin/chromium \
    EXTRA_CHROME_FLAGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--user-data-dir=/tmp/chrome,--disk-cache-dir=/tmp/chrome-cache,--disable-extensions,--disable-background-networking,--disable-default-apps,--disable-translate,--disable-breakpad,--crash-dumps-dir=/tmp/chrome-crashes \
    PAGE_LOAD_TIMEOUT=20000 \
    WAIT_AFTER_LAST_REQUEST=500

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium \
    dumb-init \
    fonts-freefont-ttf \
    fonts-liberation \
    fonts-noto-color-emoji \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app/prerender

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY server.js ./

RUN groupadd --gid 150 appuser && useradd --uid 150 --gid 150 --no-create-home appuser

USER 150

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health/ready').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
