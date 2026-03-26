# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build
WORKDIR /app

RUN apk add --no-cache git
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./

# Provide private registry auth at build time
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.29.5-alpine AS runtime
USER root
RUN apk add --no-cache gettext
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.sh

USER 150

EXPOSE 80
CMD ["/docker-entrypoint.sh"]
